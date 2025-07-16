import express from 'express';
import dotenv from 'dotenv';
import { verifySessionToken } from './verifyToken.js';

dotenv.config();
const app = express();
app.use(express.json());

app.post('/validate-session-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, error: 'No token provided' });
  }

  try {
    const payload = await verifySessionToken(token);
    return res.json({ valid: true, payload });
  } catch (err) {
    return res.status(401).json({ valid: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Middleware listening on port 3000');
});
