import { AxiosError, isAxiosError } from "axios";
import CryptoJS from "crypto-js";

export function isValidHttpUrl(str: string) {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function getErrorMessage(error: Error | AxiosError): string {
  if (isAxiosError(error)) {
    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        return error.response.data;
      }

      if (error.response.data.errors) {
        if (typeof error.response.data.errors === "object") {
          const errors = Object.values(error.response.data.errors).flat(Infinity);
          if (errors.length > 0 && typeof errors[0] === "string") {
            return errors[0];
          }
        }
      }

      if (error.response.data.validationsErrors) {
        return error.response.data.validationsErrors[0];
      }
    }
  }

  return error.message;
}

export function encryptTextMessage(message: string) {
  const keyHex = CryptoJS.enc.Utf8.parse(process.env.VITE_TEXT_MESSAGES_KEY);
  const ivHex = CryptoJS.enc.Utf8.parse(process.env.VITE_TEXT_MESSAGES_IV);

  const encrypted = CryptoJS.AES.encrypt(message, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

export function decryptTextMessage(encryptedMessage: string) {
  const plainTextFlag = "/$/plain/$/";
  const keyHex = CryptoJS.enc.Utf8.parse(process.env.VITE_TEXT_MESSAGES_KEY);
  const ivHex = CryptoJS.enc.Utf8.parse(process.env.VITE_TEXT_MESSAGES_IV);

  const parts = encryptedMessage.split(plainTextFlag);
  let decryptedMessage = "";

  parts.forEach((part, i) => {
    if (i % 2 === 0 && part) {
      try {
        const decryptedPart = CryptoJS.AES.decrypt(parts[i], keyHex, {
          iv: ivHex,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString(CryptoJS.enc.Utf8);

        decryptedMessage += decryptedPart;
      } catch (error) {
        console.error(error);
      }
    } else {
      decryptedMessage += parts[i];
    }
  });

  return decryptedMessage;
}
