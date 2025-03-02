const Gun = require("gun");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(Gun.serve);

const secretKey = crypto.randomBytes(32).toString("hex");

function encrypt(text, secretKey) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(secretKey, "hex"),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");
  return iv.toString("hex") + ":" + encrypted + ":" + authTag;
}

function decrypt(encryptedData, secretKey) {
  const [ivHex, encryptedText, authTagHex] = encryptedData.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(secretKey, "hex"),
    iv
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

app.route("/").get((req, res) => {
  res.send("GunDB server running");
});

app.route("/encrypt").post((req, res) => {
  const { message } = req.body;
  const encryptedRSA = encrypt(message, secretKey);
  res.json({ encryptedRSA });
});

app.route("/decrypt").post((req, res) => {
  try {
    const { encryptedMessage } = req.body;
    const decryptedMessage = decrypt(encryptedMessage, secretKey);
    res.json({ decryptedMessage });
  } catch (error) {
    res.status(400).json({ error: "Decryption failed" });
  }
});

const server = app.listen(8081, () => {
  console.log("GunDB server running on http://localhost:3000");
});

const gun = Gun({ web: server });
