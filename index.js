require('dotenv').config();

const express = require('express');
const { expressjwt: jwt } = require('express-jwt'); // ✅ fixed import
const jwksRsa = require('jwks-rsa');

const app = express();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

app.get('/protected', checkJwt, (req, res) => {
  res.send('Token is valid. You have accessed a protected route!');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
