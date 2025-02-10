const Gun = require('gun');
const express = require('express');
const cors = require('cors');

const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('hex');

function encrypt(text, secretKey) {
  const iv = crypto.randomBytes(12); // Initialization Vector
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(secretKey, 'hex'),
    iv
  );

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return iv.toString('hex') + ':' + encrypted + ':' + authTag;
}

const app = express();
app.use(cors());
app.use(express.json());

app.route('/').get((req, res) => {
  res.send('GunDB server running');
});

app.route('/encrypt').post((req, res) => {
  const { message } = req.body;
  const encryptedRSA = encrypt(message, secretKey);
  res.json({ encryptedRSA });
});

const server = app.listen(3000, () => {
  console.log('GunDB server running on http://localhost:3000');
});

const gun = Gun({ web: server });
