import Web3Utils from "web3-utils";
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

export function isString(s) {
    return (typeof s === "string" || s instanceof String)
}

export function isEmpty(str) {
    return (str === undefined || str === null || str.trim().length === 0);
}

export function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

export function isValidAddress(address) {
    return Web3Utils.isAddress(address);
}

export function toBaseUnit(value, decimals) {
    if (!isString(value)) {
        throw new Error("Pass strings to prevent floating point precision issues.");
    }

    const regexStr = "^(0|[1-9]\\d*)(\\.\\d{0," + decimals + "})?$";

    if (new RegExp(regexStr).test(value) === false) {
        throw new Error("INVALID_NUMBER")
    }

    const BN = Web3Utils.BN;
    const ten = new BN(10);
    const base = ten.pow(new BN(decimals));

    // Is it negative?
    let negative = (value.substring(0, 1) === "-");
    if (negative) {
        value = value.substring(1);
    }

    if (value === ".") {
        throw new Error(
            `Invalid value ${value} cannot be converted to`
            + ` base unit with ${decimals} decimals.`);
    }

    // Split it into a whole and fractional part
    let comps = value.split(".");
    if (comps.length > 2) { throw new Error("Too many decimal points"); }

    let whole = comps[0], fraction = comps[1];

    if (!whole) { whole = "0"; }
    if (!fraction) { fraction = "0"; }
    if (fraction.length > decimals) {
        throw new Error("Too many decimal places");
    }

    while (fraction.length < decimals) {
        fraction += "0";
    }

    whole = new BN(whole);
    fraction = new BN(fraction);
    let wei = (whole.mul(base)).add(fraction);

    if (negative) {
        wei = wei.neg();
    }

    return new BN(wei.toString(10), 10);
}

export function toBN(value) {
    return new Web3Utils.BN(value);
}

export function exp(base, exp) {
    return toBN(base).pow(toBN(exp));
}

export function formatUnit(value, decimals) {
    let base = new Web3Utils.BN(10).pow(new Web3Utils.BN(decimals));
    let fraction = value.mod(base).toString(10);

    while (fraction.length < decimals) {
        fraction = `0${fraction}`;
    }

    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];

    let whole = value.div(base).toString(10);
    value = `${whole}.${fraction}`;

    let paddingZeroes = decimals - fraction.length;
    while (paddingZeroes > 0) {
        paddingZeroes--;
        value = `${value}0`;
    }

    return value;
}

export function encryptUsingServiceKey(servicePublicKey, data) {
    let jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(servicePublicKey);
    return jsEncrypt.encrypt(data);
}


export function parseTestament(data, testament, encryptionKey) {
    let decryptedInfo = JSON.parse(CryptoJS.AES.decrypt(testament.encryptedInfo, encryptionKey).toString(CryptoJS.enc.Utf8));

    data.inputName = decryptedInfo.name;
    data.inputEmail = decryptedInfo.email;
    data.inputBeneficiaryName = decryptedInfo.beneficiaryName;
    data.inputBeneficiaryEmail = decryptedInfo.beneficiaryEmail;
    data.inputBeneficiaryAddress = testament.beneficiaryAddress;
    data.inputProofOfLife = Number(testament.proofOfLifeThreshold) / (24 * 3600);
    data.status = testament.status;

    data.testament = testament;
}


export function encryptTestament(name, email, beneficiaryName, beneficiaryEmail, encryptionKey) {
    let info = {
        name: name,
        email: email,
        beneficiaryName: beneficiaryName,
        beneficiaryEmail: beneficiaryEmail
    };

    return CryptoJS.AES.encrypt(JSON.stringify(info), encryptionKey).toString();
}

export function invokeMethodAndWaitConfirmation(web3, contractMethod, walletAddress, onSuccessCallback, onErrorCallback) {
    let timer = null;
    let onErrorCalled = false;
    let onSuccessCalled = false;

    function stopTimer() {
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
    }

    function onError(err) {
        if (onErrorCalled) {
            return;
        }
        onErrorCalled = true;
        stopTimer();
        onErrorCallback(err);
    }

    async function monitorTx(hash) {
        let tx = await web3.eth.getTransactionReceipt(hash);
        if (tx) {
            if (tx.status) {
                stopTimer();
                if (onSuccessCalled) {
                    return;
                }
                onSuccessCalled = true;
                onSuccessCallback();
            } else {
                onError("Transaction failed. Please try again later.");
            }
        }
    }

    contractMethod.send({ from: walletAddress, value: 0 })
        .on("transactionHash", function (hash) {
            timer = setInterval(function () { monitorTx(hash) }, 5000);
        })
        .on("error", onError);
}
