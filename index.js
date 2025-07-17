require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken'); // use jsonwebtoken directly, NOT express-jwt for simplicity

const app = express();

// Your Auth0 client secret from env
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

app.use(express.json());

app.get('/protected', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, CLIENT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token', details: err.message });
    }
    res.json({ message: 'Token verified!', user: decoded });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
