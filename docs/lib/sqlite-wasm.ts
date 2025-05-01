import { pkce } from "medfetch";
import { medfetch } from "medfetch/sqlite-wasm";

const BASE_URL =
  "https://launch.smarthealthit.org/v/r4/sim/WzIsIiIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCJ3aGF0ZXZlciIsIiIsIiIsIiIsIiIsMCwyLCIiXQ/fhir";
const CLIENT_ID = "whatever";
const REDIRECT_URI = "http://localhost:3000";
const scope = ["user/*.cruds"];

export const sql = medfetch(BASE_URL, {
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
    if (code) {
      console.log("ok!");
      const body = await exchange(code);
      return body.access_token;
    } else {
      const redirectURL = await getRedirectURL();
      window.location.href = redirectURL;
    }
    
    throw new Error("uh oh");
  },
});
