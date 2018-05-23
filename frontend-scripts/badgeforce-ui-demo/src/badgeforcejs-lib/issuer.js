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
        this.batchStatusWatcher = new bjs.BatchStatusWatcher(this.txWatcherCB.bind(this));
        this.currentPasswordCache = null;
    }

    async issueAcademic(coreData) {
        try {
            coreData.issuer = this.account.publicKey;
            console.log(coreData);
            const response = await issue(coreData, this.account.signer);
            const batchForWatch = new bjs.Batch(response.link, new bjs.MetaData('ISSUE', `Issued ${coreData.name} credential to ${coreData.recipient}`, moment().toString()));
            return this.batchStatusWatcher.subscribe(batchForWatch, this.txWatcherCB);
        } catch (error) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    async revoke(data) {
        try {
            const {recipient, credentialName, institutionId} = data;
            const hashStateAddress = namespaces.makeAddress(namespaces.ACADEMIC, recipient.concat(credentialName).concat(institutionId));
            const storageHash = await this.getIPFSHash(hashStateAddress);
            const degree = await this.getDegreeCore(storageHash.hash);
            const response = await revoke(this.account.signer.sign(Core.encode(degree.coreInfo).finish()), this.account.signer);
            const batchForWatch = new bjs.Batch(response.link, new bjs.MetaData('REVOKED', `Revoked credential ${credentialName} owned by ${recipient}`, moment().toString()));
            return this.batchStatusWatcher.subscribe(batchForWatch, this.txWatcherCB);
        } catch (error) {
            throw new Error(error);
        }       
    }
}