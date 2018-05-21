
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
            accountNotFound: 'Account not imported, import or create new account',
            invalidPassword: 'Invalid password'
        }
    }
    
    importAccount(files, password, finish) {
        try {
            const file = files.item(0);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const contents = e.target.result;
                this.account = new BadgeForceAccount(JSON.parse(contents).account);

                try {
                    this.decryptAccount(password);
                    finish(this.account, null);
                } catch (error) {
                    finish(null, error);
                }
            }
            reader.readAsText(file);
        }
        catch (error) {
            throw new Error(error);
        }
    }

    newAccount(password) {
        try {
            const keys = this.newAccessKeyPair(password);
            const signer = new CryptoFactory(context).newSigner(context.newRandomPrivateKey());
            const account = JSON.stringify({publicKey: signer.getPublicKey().asHex(), privateKey: signer._privateKey.asHex()});
            this.account = new BadgeForceAccount({account: cryptico.encrypt(account, keys.pub, keys.priv).cipher});
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    decryptAccount(password) {
        try {
            const keys = this.newAccessKeyPair(password);
            const {status, plaintext} = cryptico.decrypt(this.account.account, keys.priv);
            if(status === 'failure') {
                throw new Error(this.accountErrors.invalidPassword);
            }

            const decrypted = JSON.parse(plaintext);
            this.account.signer = new CryptoFactory(context).newSigner(new Secp256k1PrivateKey(Buffer.from(decrypted.privateKey, 'hex')));
            this.account.publicKey = this.account.signer.getPublicKey().asHex();
        } catch (error) {
            throw new Error(error.message);
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
