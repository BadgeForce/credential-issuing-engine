import * as namespaces from './namespace_prefixes';
import { Buffer } from 'buffer';

const {createHash} = require('crypto');
const {Core, StorageHash, Issuance} = require('../protos/credentials/compiled').issuer_pb;
const moment = require('moment');
const secp256k1 = require('secp256k1')

const REST_API_CHAIN = process.env.NODE_ENV === 'development' ? "http://localhost:3010" : 'http://127.0.0.1:8008';
const REST_API_IPFS = process.env.NODE_ENV === 'development' ? "http://localhost:3010/ipfs" : 'http://127.0.0.1:8080/ipfs';

export class Verifier {

    constructor(host) {
        this.host = host;

        this.errMsgs = {
            proofOfIntegrityHash: (computed, fromState) => {
                return `Proof of integrity hash computed:${computed} does not match hash from blockchain:${fromState}`
            }, 
            recipientMisMatch: (computed, fromState) => {
                return `Recipient computed:${computed} does not match recipient from blockchain:${fromState}`
            }, 
            issuerMisMatch: (computed, fromState) => {
                return `Issuer computed:${computed} does not match Issuer from blockchain:${fromState}`
            },
            signatureMisMatch: (computed, fromState) => {
                return `Signature computed:${computed} does not match Signature from blockchain:${fromState}`
            },
            invalidSignature: (signature) => {
                return `Signature ${signature} is invalid`
            },
            expired: (expiration) => {
                return `Credential is expired expiration:${expiration}`
            },
        }
    }

    decodeDegree(data) {
        return Core.decode(new Uint8Array(data));
    }

    decodeIssuance(data) {
        return Issuance.decode(new Uint8Array(data));
    }

    decodeStorageHash(data) {
        return StorageHash.decode(new Uint8Array(data));
    }

    computeIntegrityHash(credential) {
        const strToHash = credential.dateEarned.concat(credential.expiration.seconds).concat(credential.institutionId)
            .concat(credential.issuer).concat(credential.name).concat(credential.recipient)
            .concat(credential.school).concat(credential.signature);
        return createHash('sha512').update(strToHash).digest('hex').toLowerCase();
    }

    performChecks(degreeCore, issuance, callback) {
        const errors = [];
        const computedPOI = this.computeIntegrityHash(degreeCore);
        if(computedPOI !== issuance.proofOfIntegrityHash.hash) errors.push(this.errMsgs.proofOfIntegrityHash(computedPOI, issuance.proofOfIntegrityHash.hash));
        if(degreeCore.recipient !== issuance.recipientPublicKey) errors.push(this.errMsgs.recipientMisMatch(degreeCore.recipient, issuance.recipient));
        if(degreeCore.issuer !== issuance.issuerPublicKey) errors.push(this.errMsgs.issuerMisMatch(degreeCore.issuer, issuance.issuer));
        if(degreeCore.signature !== issuance.signature) errors.push(this.errMsgs.signatureMisMatch(degreeCore.signature, issuance.signature));
        if(degreeCore.expiration.seconds > 0 && moment().isAfter(new Date().setSeconds(degreeCore.expiration.seconds))) errors.push(this.errMsgs.expired(new Date().setSeconds(degreeCore.expiration.seconds).toString()));
        
        const dataHash = createHash('sha256').update(Core.encode(degreeCore).finish()).digest()
        const sigBytes = Buffer.from(degreeCore.signature, 'hex')
        console.log(secp256k1.verify(dataHash, sigBytes, Buffer.from(degreeCore.recipient, 'hex')));
        if(!secp256k1.verify(dataHash, sigBytes, Buffer.from(degreeCore.recipient, 'hex'))) errors.push(this.errMsgs.invalidSignature(degreeCore.signature));
        
        return errors;
    }

    async verifyAcademic(recipient, credentialName, institutionID) {
        try {
            // compute IPFS storage namespace address
            const hashStateAddress = namespaces.makeAddress(namespaces.ACADEMIC, recipient.concat(credentialName).concat(institutionID));
            const storageHash = await this.getIPFSHash(hashStateAddress);
            const degreeCore = await this.getDegreeCore(storageHash.hash);
            const issuanceStateAddress = namespaces.makeAddress(namespaces.ISSUANCE, degreeCore.signature.concat(degreeCore.issuer));
            const issuance = await this.getIssuance(issuanceStateAddress);
            console.log(issuance)
            console.log(degreeCore)
            const errors = this.performChecks(degreeCore, issuance)
            console.log(errors);
            // compare integrity hashes
            // do checks
        } catch (error) {
            throw new Error(error);
        }
    }

    async getIPFSHash(stateAddress) {
        try {
            const response = await this.queryState(stateAddress);
            return this.decodeStorageHash(Buffer.from(response.data[0].data, 'base64'));
        } catch (error) {
            throw new Error(error);
        }
    }

    async getIssuance(stateAddress) {
        try {
            const response = await this.queryState(stateAddress);
            return this.decodeIssuance(Buffer.from(response.data[0].data, 'base64'));
        } catch (error) {
            throw new Error(error);
        }
    }

    async getDegreeCore(hash) {
        try {
            const response = await this.queryIPFS(hash);
            return this.decodeDegree(Buffer.from(response.data, 'base64'));
        } catch (error) {
            throw new Error(error);
        }
    }

    async queryIPFS(hash) {
        try {
            const uri = `${REST_API_IPFS}/${hash}`;
            const init = {method: 'GET', headers: {'Content-Type': 'application/json'}};
            const response = await window.fetch(new Request(uri, init));
            return await JSON.parse(await response.json());
        } catch (error) {
            throw new Error(error);
        }
    }

    async queryState(address) {
        try {
            const uri = `${REST_API_CHAIN}/state?address=${address}`;
            const init = {method: 'GET', headers: {'Content-Type': 'application/json'}};
            const response = await window.fetch(new Request(uri, init));
            return JSON.parse(await response.json());
        } catch (error) {
            throw new Error(error);
        }
    }
}