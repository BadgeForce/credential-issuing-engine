const retry = require('async/retry');
const {createHash} = require('crypto');
const {AcademicCredential, Core, StorageHash, Issuance} = require('../protos/credentials/compiled').issuer_pb;
const REST_API_CHAIN = process.env.NODE_ENV === 'development' ? "http://localhost:3010" : 'http://127.0.0.1:8008';
const REST_API_IPFS = process.env.NODE_ENV === 'development' ? "http://localhost:3010/ipfs" : 'http://127.0.0.1:8080/ipfs';

export class Results {
    constructor(statusCB) {
        this.default = {message: 'Pending', success: false}
        this.checks = {0: 'Proof of Itegrity', 1: 'Recipient', 2: 'Issuer', 3: 'Signature Match', 4: 'Expiration', 5: 'Revokation', 6: 'Signature is Valid'}
        this.results = {}
        this.verified = true;
        Object.values(this.checks).forEach(val => {
            this.results[val] = this.default;
        });

        this.statusCB = statusCB;
    }

    async update(index, data) {
        if(!data.success)
            this.verified = false;
        this.results[this.checks[index]] = data;
        await this.statusCB(data);
    }
}

export class BadgeForceBase {

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

    async retry(errorFilter, times, method, args) {
        const opts = {errorFilter, times};
        const retryMethod = (retrycb) => method(...args, retrycb);
        const done = (error, results) => error ? Promise.reject(error) : Promise.resolve(results);
        retry(opts, retryMethod, done);
    }
}