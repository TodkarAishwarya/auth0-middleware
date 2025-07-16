require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('❌ No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    // ✅ HS256 token verification using shared secret
    const decoded = jwt.verify(token, process.env.HS256_SECRET);
    console.log('✅ Token verified:', decoded);
    return res.status(200).json({ message: '✅ Token is valid', user: decoded });
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(401).send('Unauthorized: Invalid token');
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
