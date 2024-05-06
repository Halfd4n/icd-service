"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const https_1 = __importDefault(require("https"));
const querystring_1 = __importDefault(require("querystring"));
let tokenCache = {
    accessToken: null,
    expiry: null,
};
const getToken = async () => {
    const currentTime = new Date();
    if (tokenCache.accessToken &&
        tokenCache.expiry &&
        tokenCache.expiry > currentTime) {
        return tokenCache.accessToken;
    }
    const postData = querystring_1.default.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scope: process.env.SCOPE,
    });
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(process.env.TOKEN_ENDPOINT, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    const accessToken = parsedData.access_token;
                    tokenCache.accessToken = accessToken;
                    tokenCache.expiry = new Date(currentTime.getTime() + 60 * 60 * 1000); // Set expiry to 60 minutes from now
                    resolve(accessToken);
                }
                catch (error) {
                    reject(new Error('Failed to parse the access token'));
                }
            });
        });
        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
};
exports.getToken = getToken;
