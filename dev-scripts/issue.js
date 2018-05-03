const namespaces = require('./namespace_prefixes');

const {createContext, CryptoFactory} = require('sawtooth-sdk/signing');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1');
const {createHash} = require('crypto');
const protobuf = require('sawtooth-sdk/protobuf');
const BigNumber = require('bignumber.js');
const request = require('request');
const context = createContext('secp256k1');
const proto = require('google-protobuf');
const any = require('google-protobuf/google/protobuf/any_pb.js');
const timestamp = require('google-protobuf/google/protobuf/timestamp_pb.js');
const payloads = require('./protos/credentials/payload_pb');
const common = require('./protos/credentials/common_pb');
const issuance = require('./protos/credentials/issuance_pb');
const degree = require('./protos/credentials/degree_pb');

const FAMILY_NAME = 'badgeforce_issuer';
const FAMILY_VERSION = '1.0';
const REST_API = 'http://127.0.0.1:8008/batches';

const pk = Buffer.from("e3ddee618d8a8864481e71021e42ed46c3ab410ab1ad7cdf0ff31f6d61739275", 'hex')
const priv = new Secp256k1PrivateKey(pk)
const signer = new CryptoFactory(context).newSigner(priv)

const recipient = new CryptoFactory(context).newSigner(context.newRandomPrivateKey());

const newSingleBatch = (inputs, outputs, signer, dependencies, payload) => {
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: FAMILY_NAME,
        familyVersion: FAMILY_VERSION,
        inputs: [...inputs],
        outputs: [...outputs],
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
        dependencies: dependencies,
        payloadSha512: createHash('sha512').update(payload).digest('hex')
    }).finish()

    const transactionSignature = signer.sign(transactionHeaderBytes)
    const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: transactionSignature,
        payload: payload
    });

    // create and sign batch 
    const transactions = [transaction]
    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: signer.getPublicKey().asHex(),
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish()
    const batchSignature = signer.sign(batchHeaderBytes)
    const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: batchSignature,
        transactions: transactions
    })

    // encode our batch
    return protobuf.BatchList.encode({
        batches: [batch]
    }).finish()
}

const submitBatch = (batch) => {
    const data = {
        url: REST_API,
        body: batch,
        headers: {'Content-Type': 'application/octet-stream'}
    }
    return request.post(data, (err, response) => {
        if (err) return console.log(err)
        console.log(response.body)
    });
}

const issue = () => {    
    const core = new degree.Core();
    core.setName("Test Credential");
    core.setSchool("School University EDU");
    core.setIssuer(signer.getPublicKey().asHex());
    core.setRecipient(recipient.getPublicKey().asHex());
    core.setDateEarned(Date.now().toString());
    core.setInstitutionid("SUEDU-1234");
    const expiration = new timestamp.Timestamp();
    expiration.setSeconds(0);
    core.setExpiration(expiration);
    core.setSignature(signer.sign(core.serializeBinary()));

    // we are going to wrap this data in google.protobuf.any, to allow for arbitrary data passing in our 1 transaction handler many subhandler scheme 
    const coreAny = new any.Any()
    coreAny.setValue(core.serializeBinary());
    coreAny.setTypeUrl('github.com/BadgeForce/badgeforce-chain-node/credentials/proto/issuer_pb.Core');

    const payload = getPayload(coreAny, payloads.PayloadAction.ISSUE);

    const namespaceAddresses = [
        namespaces.makeAddress(namespaces.ISSUANCE, core.getSignature().concat(signer.getPublicKey().asHex())),
        namespaces.makeAddress(namespaces.ACADEMIC, recipient.getPublicKey().asHex().concat(core.getName()).concat(core.getInstitutionid()))
    ];

    const inputs = [...namespaceAddresses], outputs = [...namespaceAddresses];
    console.log(namespaceAddresses)
    submitBatch(newSingleBatch(inputs, outputs, signer, [], payload));
}



const getPayload = (anyData, action) => {
    const data = new payloads.AnyData()
    data.setData(anyData);
    const payload = new payloads.Payload();
    payload.setAction(action);
    payload.setData(data);
    return payload.serializeBinary();
}

issue()