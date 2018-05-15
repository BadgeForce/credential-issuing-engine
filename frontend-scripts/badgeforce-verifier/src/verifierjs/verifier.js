import * as namespaces from './namespace_prefixes';
import { Buffer } from 'buffer';

const {createHash} = require('crypto');
const {AcademicCredential, Core, StorageHash, Issuance} = require('../protos/credentials/compiled').issuer_pb;
const moment = require('moment');
const secp256k1 = require('secp256k1')

const REST_API_CHAIN = process.env.NODE_ENV === 'development' ? "http://localhost:3010" : 'http://127.0.0.1:8008';
const REST_API_IPFS = process.env.NODE_ENV === 'development' ? "http://localhost:3010/ipfs" : 'http://127.0.0.1:8080/ipfs';

export class Results {
    constructor() {
        this.default = {message: 'Pending', success: false}
        this.checks = {0: 'Proof of Itegrity', 1: 'Recipient', 2: 'Issuer', 3: 'Signature Match', 4: 'Expiration', 5: 'Revokation', 6: 'Signature is Valid'}
        this.results = {}
        this.verified = true;
        Object.values(this.checks).forEach(val => {
            this.results[val] = this.default;
        });
    }

    update(index, data) {
        if(!data.success)
            this.verified = false;
        this.results[this.checks[index]] = data;
    }
}
export class Verifier {

    constructor(host, statusCB) {
        this.host = host;
        this.statusCB = statusCB;
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
            revoked: () => {
                return `Credential is revoked`
            },
        }
    }

    decodeDegree(data) {
        return AcademicCredential.decode(new Uint8Array(data));
    }

    decodeIssuance(data) {
        return Issuance.decode(new Uint8Array(data));
    }

    decodeStorageHash(data) {
        return StorageHash.decode(new Uint8Array(data));
    }

    computeIntegrityHash(coreInfo) {
        return createHash('sha512').update(Core.encode(coreInfo).finish()).digest('hex').toLowerCase();
    }

    newStep(title, description) {
        return { title, description, disabled: false, completed: false, active: false }
    }
    
    newSteps() {
        return {
            0: this.newStep('Proof Of Integrity', 'Checking if data was tampered with using Proof Of Integrity Hash'),
            1: this.newStep('Recipient', 'Making sure Recipient value is valid'),
            2: this.newStep('Issuer', 'Making sure Issuer value is valid'),
            3: this.newStep('Signature tampering', 'Making sure Signatures match'),
            4: this.newStep('Expiration', 'Checking if credential is expired'),
            5: this.newStep('Revokation', 'Checking if credential is revoked'),
            6: this.newStep('Signature Encryption', 'Verifying Signature with Issuer Public Key')
        }
    }
    async performChecks(degree, issuance) {
        const results = new Results();

        const computedPOI = this.computeIntegrityHash(degree.coreInfo);
        
        await this.statusCB(0, false, false);
        if(computedPOI !== issuance.proofOfIntegrityHash) 
            await this.statusCB(0, true);
            results.update(0, {message: this.errMsgs.proofOfIntegrityHash(computedPOI, issuance.proofOfIntegrityHash.hash), success: false});
        results.update(0, {message: 'Proof of integrity hash, data not tempered with', success: true});
        
        await this.statusCB(1, false, true);
        if(degree.coreInfo.recipient !== issuance.recipientPublicKey)
            await this.statusCB(1, true);
            results.update(1, {message: this.errMsgs.recipientMisMatch(degree.coreInfo.recipient, issuance.recipient), success: false});
        results.update(1, {message: 'Recipient not tempered with', success: true});

        await this.statusCB(2, false, true);
        if(degree.coreInfo.issuer !== issuance.issuerPublicKey) 
            await this.statusCB(2, true);
            results.update(2, {message: this.errMsgs.issuerMisMatch(degree.coreInfo.issuer, issuance.issuer), success: false});
        results.update(2, {message: 'Issuer not tempered with', success: true});

        await this.statusCB(3, false, true);
        if(degree.signature !== issuance.signature) 
            await this.statusCB(4, true);
            results.update(3, {message: this.errMsgs.signatureMisMatch(degree.coreInfo.signature, issuance.signature), success: false});
        results.update(3, {message: 'Signature not tempered with', success: true});

        await this.statusCB(4, false, true);
        if(moment().isAfter(moment(degree.coreInfo.expiration))) 
            await this.statusCB(4, true);
            results.update(4, {message: this.errMsgs.expired(new Date().setSeconds(degree.coreInfo.expiration.seconds).toString()), success: false});
        results.update(4, {message: 'Credential not expired', success: true});

        await this.statusCB(5, false, true);
        if(issuance.revokationStatus) 
            await this.statusCB(5, true);
            results.update(5, {message: this.errMsgs.revoked(), success: false});
        results.update(5, {message: 'Credential not revoked', success: true});

        await this.statusCB(6, false, true);
        if (!this.verifySignature(degree))
            await this.statusCB(6, true);
            results.update(6, {message: this.errMsgs.invalidSignature(degree.signature), success: false}); 
        results.update(6, {message: 'Signature is valid', success: true});
        
        await this.statusCB(6, false, true);
        return {
            results: results.results,
            degree,
            issuance
        };
    }

    verifySignature(degree) {
        const sigBytes = Buffer.from(degree.signature, 'hex');
        const dataHash = createHash('sha256').update(Core.encode(degree.coreInfo).finish()).digest();
        return secp256k1.verify(dataHash, sigBytes, Buffer.from(degree.coreInfo.issuer, 'hex'));
    }

    async readFile(files, callback) {
        try {
            const file = files.item(0);
            const reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target.result;
                const parsed = JSON.parse(contents);
                const {recipient, name, institutionId} = this.decodeDegree(Buffer.from(parsed.data, 'base64')).coreInfo;
                callback({recipient, credentialName: name, institutionId});
            }

            reader.readAsText(file);
        }

        catch (error) {
            throw new Error({message: 'Could not read file.', error});
        }
    }

    async verifyAcademic(recipient, credentialName, institutionId) {
        try {
            const hashStateAddress = namespaces.makeAddress(namespaces.ACADEMIC, recipient.concat(credentialName).concat(institutionId));
            const storageHash = await this.getIPFSHash(hashStateAddress);

            const degree = await this.getDegreeCore(storageHash.hash);
            degree.storageHash = storageHash;
            const issuanceStateAddress = namespaces.makeAddress(namespaces.ISSUANCE, degree.signature.concat(degree.coreInfo.issuer));

            const issuance = await this.getIssuance(issuanceStateAddress);
            return await this.performChecks(degree, issuance);
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