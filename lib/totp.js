import jsSHA from './sha';
import Base32Util from './base32Util';

const TOTP = (function () {
    var dec2hex = function (s) {
        return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
    };

    var hex2dec = function (s) {
        return parseInt(s, 16);
    };

    var leftpad = function (s, l, p) {
        if (l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    };

    var base32tohex = function (base32) {
        var base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        var bits = '';
        var hex = '';
        for (var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }
        for (var i = 0; i + 4 <= bits.length; i += 4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    };

    const getOTP = function (secret) {
        try {
            var epoch = Math.round(new Date().getTime() / 1000.0);
            var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');
            // var key = base32tohex(secret);
            var key = Base32Util._base32tohexUpdated(secret);

            var shaObj = new jsSHA('SHA-1', 'HEX');
            shaObj.setHMACKey(key, 'HEX');
            shaObj.update(time);

            var hmac = shaObj.getHMAC('HEX');
            var offset = hex2dec(hmac.substring(hmac.length - 1));
            var otp =
                (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) +
                '';
            otp = otp.substr(otp.length - 6, 6);
        } catch (error) {
            throw error;
        }
        return otp;
    };

    const getTime = function () {
        var epoch = Math.round(new Date().getTime() / 1000.0);
        var countDown = 30 - (epoch % 30);
        //if (epoch % 30 == 0) updateOtp();
        return countDown;
        //$('#updatingIn').text(countDown);
    };

    return {
        getTime,
        getOTP,
    };
})();

export default TOTP;
