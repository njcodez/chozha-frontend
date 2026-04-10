import Cookies from "js-cookie";
const KEY = "chozha_username";
const OPTS = { expires: 365, sameSite: "lax" as const };
export const getUsername = () => Cookies.get(KEY) ?? null;
export const setUsername = (u: string) => Cookies.set(KEY, u, OPTS);