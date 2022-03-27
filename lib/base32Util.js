/**
 * Created by Emrah on 8.11.2017.
 */
const Base32Util = {};

var _dec2hex = function (d) {
    const hD = '0123456789ABCDEF';
    var h = hD.substr(d & 15, 1);
    while (d > 15) {
        d >>= 4;
        h = hD.substr(d & 15, 1) + h;
    }
    return h;
};

var _base32_decode = function (input) {
    const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=';
    var buffer = 0;
    var bitsLeft = 0;
    var output = [];
    var i = 0;
    var count = 0;

    while (i < input.length) {
        var val = keyStr.indexOf(input.charAt(i++));
        if (val >= 0 && val < 32) {
            buffer <<= 5;
            buffer |= val;
            bitsLeft += 5;
            if (bitsLeft >= 8) {
                output[count++] = (buffer >> (bitsLeft - 8)) & 0xff;
                bitsLeft -= 8;
            }
        }
    }
    return { output: output, bitsLeft: bitsLeft };
};

Base32Util._base32tohexUpdated = function (key) {
    var result = _base32_decode(key.toUpperCase());
    var hexText = '';
    for (let i = 0; i < result.output.length; i++) {
        hexText =
            hexText +
            (result.output[i] < 16 ? '0' : '') +
            _dec2hex(result.output[i]);
    }
    return hexText;
};

export default Base32Util;
