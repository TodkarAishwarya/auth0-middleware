require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

app.use(express.json());

app.post('/verify', (req, res) => {
  // Token can come in body.token or Authorization header
  const token = req.body.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, CLIENT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token', details: err.message });
    }
    res.json({ message: 'Token verified successfully!', user: decoded });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
