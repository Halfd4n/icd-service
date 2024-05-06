import https from 'https';
import querystring from 'querystring';

interface TokenCache {
  accessToken: string | null;
  expiry: Date | null;
}

let tokenCache: TokenCache = {
  accessToken: null,
  expiry: null,
};

export const getToken = async (): Promise<string> => {
  const currentTime = new Date();

  if (
    tokenCache.accessToken &&
    tokenCache.expiry &&
    tokenCache.expiry > currentTime
  ) {
    return tokenCache.accessToken;
  }

  const postData = querystring.stringify({
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: process.env.SCOPE,
  });

  const options: https.RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(process.env.TOKEN_ENDPOINT!, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          const accessToken = parsedData.access_token as string;
          tokenCache.accessToken = accessToken;
          tokenCache.expiry = new Date(currentTime.getTime() + 60 * 60 * 1000); // Set expiry to 60 minutes from now
          resolve(accessToken);
        } catch (error) {
          reject(new Error('Failed to parse the access token'));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
};
