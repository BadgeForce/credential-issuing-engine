
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
    
    importAccount(files, password, done) {
        try {
            const file = files.item(0);
            const callback = (err, account) => {
                if(err) {
                    done(err, null);
                } else {
                    try {
                        this.decryptAccount(password, account);
                        done(null, this.account);
                    } catch (error) {                    
                        done(error, account);
                    }
                }
            }
            this.readFile(file, this.fileTypes.account, callback)
        }
        catch (error) {
            done(error, null);
        }
    }

    newAccount(password) {
        try {
            const keys = this.newAccessKeyPair(password);
            const signer = new CryptoFactory(context).newSigner(context.newRandomPrivateKey());
            const account = JSON.stringify({publicKey: signer.getPublicKey().asHex(), privateKey: signer._privateKey.asHex()});
            this.account = new BadgeForceAccount({account: cryptico.encrypt(account, keys.pub, keys.priv).cipher});
            this.account.signer = signer;
            this.account.publicKey = signer.getPublicKey().asHex();
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    decryptAccount(password, account) {
        try {
            account = new BadgeForceAccount(account);
            const keys = this.newAccessKeyPair(password);
            const {status, plaintext} = cryptico.decrypt(account.account, keys.priv);
            if(status === 'failure') {
                throw new Error(this.accountErrors.invalidPassword);
            }

            const decrypted = JSON.parse(plaintext);
            account.signer = new CryptoFactory(context).newSigner(new Secp256k1PrivateKey(Buffer.from(decrypted.privateKey, 'hex')));
            account.publicKey = account.signer.getPublicKey().asHex();

            this.account = account;
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
