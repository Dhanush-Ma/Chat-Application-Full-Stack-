import CryptoJS from "crypto-js";
// function to generate random encrypted string from two strings
function encryptStrings(str1, str2) {
  // concatenate the two strings with a separator
  let combinedStr = str1 + "|" + str2;

  // generate a random key for encryption
  let key = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 16; i++) {
    key += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  // encrypt the combined string using the key and AES encryption
  let encrypted = CryptoJS.AES.encrypt(combinedStr, key);

  // return the encrypted string and key as an object
  return {
    key: key,
    encryptedString: encrypted.toString(),
  };
}

// function to decrypt an encrypted string using a key
function decryptString(encryptedString, key) {
  // decrypt the string using the key and AES decryption
  let decrypted = CryptoJS.AES.decrypt(encryptedString, key);
  let combinedStr = decrypted.toString(CryptoJS.enc.Utf8);

  // split the combined string into the original two strings using the separator
  let [str1, str2] = combinedStr.split("|");

  // return the two original strings as an array
  return [str1, str2];
}

// example usage
let [str1, str2] = ["hello", "world"];
let { key, encryptedString } = encryptStrings(str1, str2);
console.log("Encrypted string:", encryptedString);
console.log("Key:", key);
console.log("Decrypted strings:", decryptString(encryptedString, key));
