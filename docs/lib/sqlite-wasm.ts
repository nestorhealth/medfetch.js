import { pkce } from "medfetch";
import { medfetch } from "medfetch/sqlite-wasm";

export const sql = medfetch("https://r4.smarthealthit.org", {
  trace: true
});

const BASE_URL =
  "https://launch.smarthealthit.org/v/r4/sim/WzIsIiIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCJ3aGF0ZXZlciIsIiIsIiIsIiIsIiIsMCwyLCIiXQ/fhir";
const CLIENT_ID = "whatever";
const REDIRECT_URI = process.env.NODE_ENV === "development" ? "http://localhost:3000/sql" : "https://medfetchjs.pages.dev/sql";
const scope = ["user/*.cruds"];

export const sql2 = medfetch(BASE_URL, {
  trace: true,
  async getAccessToken() {
    const { getRedirectURL, exchange } = pkce(
      BASE_URL,
      CLIENT_ID,
      REDIRECT_URI,
      scope,
    );
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    let body: Awaited<ReturnType<typeof exchange>>;
    try {
      if (code) {
        body = await exchange(code);
      } else {
        const redirectURL = await getRedirectURL();
        window.location.href = redirectURL;
        throw new Error("This shouldn't happen");
      }
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (body)
      return body;
    
    throw new Error("Shouldn't happen");
  },
});
