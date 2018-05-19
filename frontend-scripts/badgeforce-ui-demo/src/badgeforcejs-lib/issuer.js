import * as namespaces from './namespace_prefixes';
import {issue} from './transaction';
import bjs from '../badgeforcejs-lib';
import { revoke } from './transaction';
import { AccountManager } from './account_manager';
const {Core} = require('../protos/credentials/compiled').issuer_pb;
const moment = require('moment');



export class Issuer extends AccountManager {

    constructor(host, txWatcherCB) {
        super();
        this.host = host;
        this.txWatcherCB = txWatcherCB;
        this.batchStatusWatcher = new bjs.BatchStatusWatcher(this.txWatcherCB);
        this.currentPasswordCache = null;
    }

    async IssueAcademic(accountPassword, invalidPasswordCB) {
        try {
            this.currentPasswordCache = accountPassword;
            const errorFilter = err => { return [this.accountErrors.invalidPassword].filter(msg => {return err.message === msg})};
            const {signer, publicKey} = await this.retry(errorFilter, 3, this.decryptWithRetries.bind(this), [accountPassword, invalidPasswordCB]);
            return {finish: async coreData => await this.issueAcademic(coreData, signer, publicKey)};
        } catch (error) {
            throw new Error(error);
        }
    }

    async decryptWithRetries(accountPassword, invalidPasswordCB, retrycb) {
        try {
            return this.decryptAccount(accountPassword, retrycb);
        } catch (error) {
            if(error.message === this.accountErrors.invalidPassword.message) {
                invalidPasswordCB(error.message+' yooo bruh')
                // this.currentPasswordCache = await invalidPasswordCB();
                throw new Error(error);
            }
            throw new Error(error);
        }
    }

    async issueAcademic(coreData, signer, publicKey) {
        try {
            coreData.issuer = publicKey;
            console.log(coreData);
            const response = await issue(coreData, signer);
            const batchForWatch = new bjs.Batch(response.link, new bjs.MetaData('ISSUE', `Issued ${coreData.name} credential to ${coreData.recipient}`, moment().toString()));
            this.batchStatusWatcher.subscribe(batchForWatch, (status) => {
                console.log(status);
            });
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    async revoke(data) {
        try {
            const {recipient, credentialName, institutionId} = data;
            const hashStateAddress = namespaces.makeAddress(namespaces.ACADEMIC, recipient.concat(credentialName).concat(institutionId));
            const storageHash = await this.getIPFSHash(hashStateAddress);
            const degree = await this.getDegreeCore(storageHash.hash);
            const response = await revoke(this.signer.sign(Core.encode(degree.coreInfo).finish()));
            const batchForWatch = new bjs.Batch(response.link, new bjs.MetaData('REVOKED', `Revoked credential ${credentialName} owned by ${recipient}`, moment().toString()));
            this.batchStatusWatcher.subscribe(batchForWatch, (status) => {
                console.log(status);
            });
        } catch (error) {
            throw new Error(error);
        }       
    }
}