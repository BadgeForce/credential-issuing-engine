const retry = require('async/retry');
const {createHash} = require('crypto');
const secp256k1 = require('secp256k1');
const validator = require('validator');
const {AcademicCredential, Core, StorageHash, Issuance} = require('../protos/credentials/compiled').issuer_pb;

const CONFIG_DEFAULT = {
    endpoints: {
        chain: { host: 'https:testnet.badgeforce.io', endpoint: ''},
        ipfs: { host: 'https:testnet.badgeforce.io', endpoint: '/ipfs'},
    }
}
export class Config {
    api = 'https://testnet.badgeforce.io';
    chainAPI = { host: 'http://localhost', port: 3010, endpoint: ''}
    ipfsAPI = { host: 'http://localhost', port: 3010, endpoint: '/ipfs'}

    validateConfig(config) {
        if(!config || !config.endpoints) return;
        const { endpoints } = config;
        if(!validator.isURL(endpoints.chain.host) && !validator.isPort(endpoints.chain.port+'')) throw new Error(`Invalid chain API config: ${endpoints.chain}`);
        if(!validator.isURL(endpoints.ipfs.host) && !validator.isPort(endpoints.ipfs.port+'')) throw new Error(`Invalid IPFS API config: ${endpoints.ipfs}`);
        this.chainAPI = endpoints.chain;
        this.ipfsAPI = endpoints.ipfs;
    }

    getChainAPI(endpoint) {
        return `${this.chainAPI.host}:${this.chainAPI.port}${endpoint}`;
    }

    getIPFSAPI() {
        return `${this.ipfsAPI.host}:${this.ipfsAPI.port}${this.ipfsAPI.endpoint}`;
    }
}
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

export class ProtoDecoder {
    protos = {
        AcademicCredential: {name: Object.getPrototypeOf(AcademicCredential).constructor.name, verify: AcademicCredential.verify},
        Issuance: {name: Object.getPrototypeOf(Issuance).constructor.name, verify: Issuance.verify},
        StorageHash: {name: Object.getPrototypeOf(StorageHash).constructor.name, verify: StorageHash.verify}
    };
    
    isValidProto(proto) {
        const name = Object.getPrototypeOf(proto).constructor.name;
        if(!this.protos[name]) return false;

        return !this.protos[name].verify(proto);
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

    static encodedQRDegree(data) {
        console.log(data)
        const b = AcademicCredential.encode(AcademicCredential.create(data)).finish();
        return Buffer.from(b).toString('base64')
    }
}

export class Importer extends ProtoDecoder{
    fileTypes = {
        bfac: 'BFAC',  
        account: 'ACCOUNT',
        image: 'IMAGE', 
        imageExts: ['image/jpg', 'image/jpeg', 'image/png']
    };
    accountArgsErr = args => `Invalid arguments ${args[0] ? 'callback' : 'undefined'} `
        .concat('callback required');
    imageArgsErr = args => `Invalid arguments ${args[0] ? 'callback' : 'undefined'} `
        .concat('callback required');
    imageSizeErr = size => `File Size ${Math.floor(size/1024/1024)}MB exceeds limit 50MB`;
    bfacArgsErr = args => `Invalid arguments ${args[0] ? 'callback' : 'undefined'} `
        .concat('callback required');
    invalidFileTypeErr = fileType => `Invalid filetype: ${fileType}`;

    validateImage(file) {
        if(this.fileTypes.imageExts.filter(ftype => ftype !== file.type).length === 1) {
            throw new Error(this.invalidFileTypeErr(file.type));
        }
        if(Math.floor(file.size/1024/1024) > 50) {
            throw new Error(this.imageSizeErr(file.size));
        }
    }

    import(args, fileType) {
        let errorMsg = null,
            read = null;
        const reader = new FileReader();
        switch (fileType) {
            case this.fileTypes.account:
                errorMsg = this.accountArgsErr(args);
                reader.onload = this.accountJSONOnload(args[2]);
                read = (file) => reader.readAsText(file);
                break;
            case this.fileTypes.bfac:
                errorMsg = this.accountArgsErr(args);
                reader.onload = this.bfacOnload(args[2]);
                read = (file) => reader.readAsText(file);
                break;
            case this.fileTypes.image:
                errorMsg = this.accountArgsErr(args);
                reader.onloadend = this.imageOnLoad(args[2]);
                read = (file) => reader.readAsDataURL(file);
                break;
            default:
                throw new Error(this.invalidFileTypeErr(fileType));
        }
        if(!args || args.length < 3) throw new Error(errorMsg);
        if(fileType === this.fileTypes.image) this.validateImage(args[0]);
        read(args[0]);
    }

    accountJSONOnload(done) {
        return (e) => {
            let account,
                err = null;
            try {
                account = JSON.parse(e.target.result).account;
            } catch (error) {
                err = new Error('Malformed account data');
            }

            done(err, account);
        } 
    }

    bfacOnload(done) {
        return (e) => {
            const contents = e.target.result;
            let invalidFileType = null,
                degree = null;                   
            try {
                const parsed = JSON.parse(contents);
                degree = this.decodeDegree(Buffer.from(parsed.data, 'base64')).coreInfo;
            } catch (error) {
                console.log(error)
                invalidFileType = new Error(this.invalidFileTypeErr('Unknown'));
            }
            
            done(invalidFileType, degree);
        }
    }

    imageOnLoad(done) {
        return (reader) => done(reader.target.result);
    }

    readFile(file, fileType, callback) {
        this.import([file, fileType, callback], fileType);
    }
}

export class BadgeForceBase extends Importer{
    constructor(config) {
        super();
        this.config = new Config(config);
        // this.config = new Config(CONFIG_DEFAULT)
    }

    isValidPublicKey(key) {
        return secp256k1.publicKeyVerify(Buffer.from(key, 'hex'));
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
            const uri = `${this.config.getIPFSAPI()}/${hash}`;
            const init = {method: 'GET', headers: {'Content-Type': 'application/json'}};
            const response = await window.fetch(new Request(uri, init));
            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    }

    async queryState(address) {
        try {
            const uri = `${this.config.getChainAPI("/state")}?address=${address}`;
            const init = {method: 'GET', headers: {'Content-Type': 'application/json'}};
            const response = await window.fetch(new Request(uri, init));
            return await response.json();
        } catch (error) {
            throw new Error(error);
        }
    }

    async retry(errorFilter, times, method, args, done) {
        const opts = {errorFilter, times};
        console.log(args);
        const retryMethod = (retrycb) => method(...args, retrycb);
        retry(opts, retryMethod, done);
    }
}