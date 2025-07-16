// index.js
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require('dotenv').config();

const app = express();

// RS256 verification middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

app.get('/protected', checkJwt, (req, res) => {
  res.send({ message: '✅ Token verified successfully!', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
