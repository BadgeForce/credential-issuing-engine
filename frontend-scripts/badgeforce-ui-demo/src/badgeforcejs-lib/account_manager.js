
const cryptico = require('cryptico');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1');
const {createContext, CryptoFactory} = require('sawtooth-sdk/signing');
const { BadgeForceBase } = require('./badgeforce_base');
const context = createContext('secp256k1');

class BadgeForceAccount {
    constructor(encryptedAccount) {
        this.downloadStr = JSON.stringify(encryptedAccount);
        this.account = encryptedAccount;
        this.signer = null;
        this.publicKey = null;
    }
}

export class AccountManager extends BadgeForceBase {
    constructor() {
        super();
        this.account = null;
        this.accountErrors = {
            accountNotFound: new Error('Account not imported, import or create new account'),
            invalidPassword: new Error('Invalid password')
        }
    }
    
    importAccount(files, password, callback) {
        try {
            const file = files.item(0);
            const reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target.result;
                this.account = new BadgeForceAccount(JSON.parse(contents).account);
                this.decryptAccount(password)
                callback(this.account);
            }
            reader.readAsText(file);
        }
        catch (error) {
            throw new Error(error);
        }
    }

    newAccount(password) {
        try {
            console.log(password);
            const keys = this.newAccessKeyPair(password);
            console.log(keys);
            const signer = new CryptoFactory(context).newSigner(context.newRandomPrivateKey());
            const account = JSON.stringify({publicKey: signer.getPublicKey().asHex(), privateKey: signer._privateKey.asHex()});
            this.account = new BadgeForceAccount({account: cryptico.encrypt(account, keys.pub, keys.priv).cipher});
            console.log(this.account)
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    decryptAccount(password, retrycb) {
        try {
            console.log(password)
            const keys = this.newAccessKeyPair(password);
            console.log(keys)
            const {status, plaintext} = cryptico.decrypt(this.account.account, keys.priv);
            if(status === 'failure') {
                throw this.accountErrors.invalidPassword;
            }

            const decrypted = JSON.parse(plaintext);
            this.account.signer = new CryptoFactory(context).newSigner(new Secp256k1PrivateKey(Buffer.from(decrypted.privateKey, 'hex')));
            this.account.publicKey = this.account.signer.getPublicKey().asHex();

            // if(retrycb) retrycb({signer, publicKey});
            console.log(this.account);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    
    newAccessKeyPair(password) {
        try {
            const priv = cryptico.generateRSAKey(password, 1024);
            const pub = cryptico.publicKeyString(priv);
            return {priv, pub}
        } catch (error) {
            throw new Error(error);
        }
    }
}
