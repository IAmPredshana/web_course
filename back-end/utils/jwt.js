const SECRETKEY="80fb46f633259af9a231ab871927d11164c88ceb0008e5ea6739ac05acb81583"

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export { SECRETKEY, parseJwt }