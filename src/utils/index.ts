import fetch from "node-fetch";
import AbortController from "abort-controller";
import cryptoJs from "crypto-js";

export const TIME_BETWEEN_SAME_USER_VIEWS = 6 * (60 * 60 * 1000);
export const LIMIT_MAX_PAGINATION = 50;

export const fetchTimeout = async  (
  url: string,
  options: any = null,
  timeoutLimit = 30000
) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutLimit);
  return fetch(url, {
    ...options,
    signal,
  }).finally(() => {
    clearTimeout(timeout);
  });
};

export const isURL = (str: string) => {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

export const removeURLSlash = (url: string) => {
  if (url.length === 0) return url;
  const lastChar = url.charAt(url.length - 1);
  if (lastChar === "/") {
    return url.slice(0, -1);
  } else {
    return url;
  }
};

export const ATELIER_STUDIO_API_URL = process.env.ATELIER_STUDIO_API_URL  ? removeURLSlash(process.env.ATELIER_STUDIO_API_URL)
  : "";

export const decryptCookie = (cookie: string) => {
  try {
    if (!process.env.SECRET_COOKIE) return cookie;
    const bytes = cryptoJs.AES.decrypt(cookie, process.env.SECRET_COOKIE);
    const decryptedCookie = bytes.toString(cryptoJs.enc.Utf8);
    return decryptedCookie;
  } catch (err) {
    return "";
  }
};

export const convertSortString = (sortString: string) => {
  if (sortString) {
    const sortArray = sortString.split(",");
    let finalString = "";
    sortArray.forEach((x) => {
      const fieldArray = x.split(":");
      if (fieldArray[0]) {
        finalString += `${fieldArray[0].toUpperCase()}_${
          fieldArray[1] ? fieldArray[1].toUpperCase() : "ASC"
        },`;
      }
    });
    return finalString;
  } else {
    return "";
  }
};
