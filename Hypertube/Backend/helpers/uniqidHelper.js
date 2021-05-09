var uniqid = require('uniqid');

function generateUniqid() {
    return uniqid();
}

module.exports = {
    generateUniqid
}