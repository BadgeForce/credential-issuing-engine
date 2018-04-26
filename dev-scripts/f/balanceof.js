const {createContext, CryptoFactory} = require('sawtooth-sdk/signing')
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1');
const {createHash} = require('crypto')
const {protobuf} = require('sawtooth-sdk')
const request = require('request')
const fs = require('fs');


const context = createContext('secp256k1')
const pk = Buffer.from("e3ddee618d8a8864481e71021e42ed46c3ab410ab1ad7cdf0ff31f6d61739275", 'hex')
const priv = new Secp256k1PrivateKey(pk)
const signer = new CryptoFactory(context).newSigner(priv)
const cbor = require('cbor')

const payload = {
    action: "GET_BALANCEOF",
    address: "02ccb8bc17397c55242a27d1681bf48b5b40a734205760882cd83f92aca4f1cf45"
}

const payloadBytes = cbor.encode(payload)

const namespace = createHash('sha512').update('props_token').digest('hex').substring(0, 6)
const stateAddress = createHash('sha512').update("balances").digest('hex').toLowerCase().substring(0, 64)

console.log("stateaddr", stateAddress)

const inputs = namespace.concat(stateAddress);
console.log("Inputs",inputs, "\n")

const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: 'propstoken',
    familyVersion: '1.0',
    inputs: [inputs],
    outputs: [inputs],
    signerPublicKey: signer.getPublicKey().asHex(),
    // In this example, we're signing the batch with the same private key,
    // but the batch can be signed by another party, in which case, the
    // public key will need to be associated with that key.
    batcherPublicKey: signer.getPublicKey().asHex(),
    // In this example, there are no dependencies.  This list should include
    // an previous transaction header signatures that must be applied for
    // this transaction to successfully commit.
    // For example,
    // dependencies: ['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
}).finish()

const signature = signer.sign(transactionHeaderBytes)

const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: signature,
    payload: payloadBytes
})

const transactions = [transaction]

const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
}).finish()

const signature1 = signer.sign(batchHeaderBytes)

const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: signature1,
    transactions: transactions
})

const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
}).finish()
console.log(batchListBytes)
// request.get({
//     url: 'http://127.0.0.1:8008/batches',
//     // body: batchListBytes,
//     headers: {'Content-Type': 'application/json'}
// }, (err, response) => {
//     if (err) return console.log(err)
//     console.log(response.body)
// })

console.log("priv", signer._privateKey.asHex())
console.log("pub", signer.getPublicKey().asHex(), '\n')
console.log("namespace", namespace);

request.post({
    url: 'http://127.0.0.1:8008/batches',
    body: batchListBytes,
    headers: {'Content-Type': 'application/octet-stream'}
}, (err, response) => {
    if (err) return console.log(err)
    console.log(response.body)
})

// stateaddr 1cfbb70d5894fbdcdcdcab4e33dc3f540d79e7d093e06a5b1ee618e8a1f297b0
// Inputs 4f5aa21cfbb70d5894fbdcdcdcab4e33dc3f540d79e7d093e06a5b1ee618e8a1f297b0

// priv e3ddee618d8a8864481e71021e42ed46c3ab410ab1ad7cdf0ff31f6d61739275
// pub 02ccb8bc17397c55242a27d1681bf48b5b40a734205760882cd83f92aca4f1cf45
