require("dotenv").config();
const crypto = require("crypto");
var algorithm = process.env.ALGORITHM;
var key = Buffer.from(process.env.KEY);
var iv = Buffer.from(process.env.IV);

exports.encrypt = (text) => {
  algorithm = process.env.ALGORITHM;
  key = Buffer.from(process.env.KEY);
  iv = Buffer.from(process.env.IV);
  try {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
  } catch (error) {
    return error;
  }
};

exports.decrypt = (text) => {
  algorithm = process.env.ALGORITHM;
  key = Buffer.from(process.env.KEY);
  iv = Buffer.from(process.env.IV);
  try {
    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    return error;
  }
};


