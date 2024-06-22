import {AxiosError, isAxiosError} from "axios";
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

export function base64ImageToBlob(image: string) {
  const byteString = atob(image.split(",")[1]);
  const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

export function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function encryptTextMessage(message: string) {
  return CryptoJS.AES.encrypt(message, import.meta.env.VITE_TEXT_MESSAGES_SECRET).toString()
}

export function decryptTextMessage(encryptedMessage: string) {
  return CryptoJS.AES.decrypt(encryptedMessage, import.meta.env.VITE_TEXT_MESSAGES_SECRET).toString(CryptoJS.enc.Utf8)
}