// verifyToken.js

import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

export function verifySessionToken(token) {
  return new Promise((resolve, reject) => {
    jwt.decode(token, { complete: true });

    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || !decoded.header || !decoded.header.kid) {
      return reject(new Error('Invalid token format'));
    }

    client.getSigningKey(decoded.header.kid, (err, key) => {
      if (err) {
        return reject(err);
      }

      const signingKey = key.getPublicKey();

      jwt.verify(
        token,
        signingKey,
        {
          algorithms: ['RS256'],
          issuer: `https://${process.env.AUTH0_DOMAIN}/`
        },
        (err, decodedPayload) => {
          if (err) {
            return reject(err);
          }

          resolve(decodedPayload);
        }
      );
    });
  });
}
