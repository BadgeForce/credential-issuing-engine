const {createHash} = require('crypto');

const GLOBAL_PREFIX = 'credentials:'
const ACADEMIC_PREFIX = `${GLOBAL_PREFIX}academic`;
const ISSUANCE_PREFIX = `${GLOBAL_PREFIX}issuer:issuance`;

const ACADEMIC = createHash('sha512').update(ACADEMIC_PREFIX).digest('hex').substring(0, 6)
const ISSUANCE = createHash('sha512').update(ISSUANCE_PREFIX).digest('hex').substring(0, 6)
const makeAddress = (prefix, postfix) => {
    return prefix.concat(createHash('sha512').update(postfix).digest('hex').toLowerCase().substring(0, 64));
}


module.exports = {
    ACADEMIC, ISSUANCE, makeAddress
}