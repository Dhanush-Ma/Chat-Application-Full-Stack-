import CryptoJS from "crypto-js";

function generateUniqueString(str1, str2) {
  const concatenatedString = str1 + str2;
  const sortedString = concatenatedString.split("").sort().join("");
  const hash = CryptoJS.SHA256(sortedString).toString();
 
  return hash;
}

export default generateUniqueString;
