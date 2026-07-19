export function setCookie(res, name, value, expiryInDays = 7, options = {}) {
    res.cookie(name, value, {
        httpOnly: true,
        maxAge: expiryInDays * 24 * 60 * 60 * 1000,
        ...options,
    });
}

export function getCookie(req, name) {
    return req.cookies?.[name] || null;
}

export function clearCookie(res, name, options = {}) {
    res.clearCookie(name, { httpOnly: true, ...options, });
}
