const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.AUTH0_SECRET, {
      algorithms: ['HS256'],
      issuer: `https://${process.env.AUTH0_DOMAIN}/`
    });

    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

app.get('/protected', checkJwt, (req, res) => {
  res.send(`Token is valid. Welcome ${req.user.firstName || 'user'}!`);
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
