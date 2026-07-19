import dns from "dns";
import validator from "validator";
import { ABSTRACT_EMAIL_API_URL, ABSTRACT_PHONE_API_URL, STATUS_VALID, STATUS_INVALID } from "../constants.js";

export async function verifyEmailReal(email) {
    const url = `${ABSTRACT_EMAIL_API_URL}&email=${email}`;
    console.log("verifyEmailReal", url)

    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.email_deliverability?.status === "deliverable" ? STATUS_VALID : STATUS_INVALID;
    } catch {
        try {
            const hasMx = await dns.promises.resolveMx(email.split("@")[1]).then(r => r.length > 0).catch(() => false);
            return hasMx ? STATUS_VALID : STATUS_INVALID;
        } catch {
            return STATUS_INVALID;
        }
    }
}

export async function verifyPhoneReal(phoneNumber) {
    if (!validator.isMobilePhone(phoneNumber, "en-IN")) return STATUS_INVALID;

    const url = `${ABSTRACT_PHONE_API_URL}&phone=${phoneNumber}`;
    console.log("verifyPhoneReal", url)

    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.phone_validation?.is_valid ? STATUS_VALID : STATUS_INVALID;
    } catch {
        return STATUS_VALID;
    }
}
