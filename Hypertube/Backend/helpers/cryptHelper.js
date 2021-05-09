const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

function crypt(str) {
    return bcrypt.hashSync(str, salt);
}

async function compare(str1, str2) {
    return await bcrypt.compare(str1, str2);
}

module.exports = {
    crypt,
    compare
}