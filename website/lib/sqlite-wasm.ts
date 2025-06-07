import { medfetch } from "medfetch/sqlite-wasm";
import { sql as kyselySql } from "kysely";

export const db = medfetch("https://r4.smarthealthit.org");

/**
 * 
 * @param strings 
 * @param rest 
 * @returns 
 */
export function sql<T>(strings: TemplateStringsArray, ...rest: any[]): Promise<T[]> {
  return kyselySql<T>(strings, ...rest).execute(db).then(result => result.rows);
}

const BASE_URL =
  "https://launch.smarthealthit.org/v/r4/sim/WzIsIiIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCJ3aGF0ZXZlciIsIiIsIiIsIiIsIiIsMCwyLCIiXQ/fhir";
// const CLIENT_ID = "whatever";
// const REDIRECT_URI = process.env.NODE_ENV === "development" ? "http://localhost:3000/sql" : "https://medfetchjs.pages.dev/sql";
// const scope = ["user/*.cruds"];

const authDB = medfetch(BASE_URL, {
  // async getAccessToken() {
  //   const { getRedirectURL, exchange } = pkce(
  //     BASE_URL,
  //     CLIENT_ID,
  //     REDIRECT_URI,
  //     scope,
  //   );
  //   const params = new URLSearchParams(window.location.search);
  //   const code = params.get("code");
  //   let body: Awaited<ReturnType<typeof exchange>>;
  //   try {
  //     if (code) {
  //       body = await exchange(code);
  //     } else {
  //       const redirectURL = await getRedirectURL();
  //       window.location.href = redirectURL;
  //       throw new Error("This shouldn't happen");
  //     }
  //   } finally {
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   }

  //   if (body)
  //     return body;
    
  //   throw new Error("Shouldn't happen");
  // },
});

export function sql2(strings: TemplateStringsArray, ...rest: any[]) {
  return kyselySql(strings, rest).execute(authDB).then(result => result.rows);
}