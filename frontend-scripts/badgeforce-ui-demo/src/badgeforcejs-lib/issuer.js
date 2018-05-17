import * as namespaces from './namespace_prefixes';
import { Buffer } from 'buffer';
import {issue} from './transaction';
import bjs from '../badgeforcejs-lib';

const {createHash} = require('crypto');
const {createContext, CryptoFactory} = require('sawtooth-sdk/signing');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1');
const context = createContext('secp256k1');
const moment = require('moment');
const secp256k1 = require('secp256k1');



export class Issuer {

    constructor(host, txWatcherCB) {
        this.host = host;
        this.txWatcherCB = txWatcherCB;
        this.signer = new CryptoFactory(context).newSigner(context.newRandomPrivateKey());
        this.accountStrPlain = JSON.stringify({publicKey: this.publicKey, privateKey: this.signer._privateKey.asHex()});
        this.publicKey = this.signer.getPublicKey().asHex();
        this.batchStatusWatcher = new bjs.BatchStatusWatcher(this.txWatcherCB);
    }

    async issueAcademic(coreData) {
        try {
            coreData.issuer = this.publicKey;
            console.log(coreData);
            const response = await issue(coreData, this.signer);
            const batchForWatch = new bjs.Batch(response.link, new bjs.MetaData('ISSUE', `Issued ${coreData.name} credential to ${coreData.recipient}`, moment().toString()));
            this.batchStatusWatcher.subscribe(batchForWatch, (status) => {
                console.log(status);
            });
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }
}