const validator = require('validator');
const readChunk = require('read-chunk');
const imageType = require('image-type');


function checkName(value) {
    var regExp = new RegExp("^[a-zA-Z-]{1,100}$");
    return (typeof value === 'string') && regExp.test(value) && validator.isLength(value, { min: 1, max: 100 });
}

function checkUsername(value) {
    var regExp = new RegExp("^[a-zA-Z0-9-]{1,100}$");
    return (typeof value === 'string') && regExp.test(value) && validator.isLength(value, { min: 1, max: 100 });
}

function checkPassword(value) {
    var regExp = new RegExp("^[a-zA-Z0-9]{5,100}$");
    return (typeof value === 'string') && regExp.test(value) && validator.isLength(value, { min: 5, max: 100 });
}

function checkEmail(value) {
    return (typeof value === 'string') && validator.isEmail(value) && validator.isLength(value, { min: 1, max: 100 });
}

function checkIsString(value) {
    return (typeof value === 'string');
}

function checkLength(value, minValue, maxValue) {
    return validator.isLength(value, { min: minValue, max: maxValue });
}

function checkLanguage(value) {
    return value === "0" || value === "1" || value === "2";
}

function checkImage(path) {
    const buffer = readChunk.sync(path, 0, 12);
    const imageTypeRes = imageType(buffer);
    if (imageTypeRes === null) {
        return false;
    }
    return true;
}

module.exports = {
    checkName,
    checkUsername,
    checkEmail,
    checkPassword,
    checkIsString,
    checkLength,
    checkLanguage,
    checkImage
};