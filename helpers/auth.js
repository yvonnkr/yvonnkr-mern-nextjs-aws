import cookie from "js-cookie";
import Router from "next/router";

//#region check if browser / server /window
/* 
 for client-side-render like in cra use if(window) 
 for nextjs if csr use if(process.browser)
 for nextjs if ssr use if(process.server)
*/
//#endregion

//#region cookie helpers *****************************************
// set in cookie
export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, { expires: 1 });
  }
};

// remove cookie
export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key);
  }
};

// get from cookie
export const getCookie = (key, req) => {
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

export const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }

  const token = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));

  if (!token) {
    return undefined;
  }

  const tokenValue = token.split("=")[1];

  return tokenValue;
};
//#endregion

//#region localHost helpers **************************************
// set in localstoarge
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from localstorage
export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

//*****MAIN FUNC --utilises above funcs *****
// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};
//#endregion

//*****MAIN FUNC --utilises above funcs *****
// access user info from localstorage
export const isAuth = () => {
  if (process.browser) {
    const token = getCookie("token");

    if (token) {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        return user;
      } else {
        return false;
      }
    }
  }
};

//*****MAIN FUNC --utilises above funcs *****
//logout remove both cookie/localStorage
export const logout = () => {
  removeCookie("token");
  removeLocalStorage("user");
  Router.push("/login");
};
