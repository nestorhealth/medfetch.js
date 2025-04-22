"use client";
import { useEffect } from "react";

const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets"
].join(",");

export function googleRedirectURI() {
  let authURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authURL.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  authURL.searchParams.set("redirect_uri", REDIRECT_URI);
  authURL.searchParams.set("response_type", "token");
  authURL.searchParams.set("scope", GOOGLE_SCOPES);
  authURL.searchParams.set("include_granted_scopes", "true");
  authURL.searchParams.set("prompt", "consent");
  return authURL.toString();
}

export async function createSpreadsheet(token: string, title: string = "ab_dataset") {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title
      },
    }),
  });

  if (!response.ok)
    throw new Error(await response.text());

  const payload = await response.json();

  if (!payload["spreadsheetId"])
    throw new Error(`Unexpected payload from Google, aborting export.`);
  if (typeof payload["spreadsheetId"] !== "string")
    throw new Error(`Unexpected non string spreadsheetId payload from Google, aborting export.`);

  return payload["spreadsheetId"] as string;
}

export async function writeToSpreadsheet(token: string, sheetId: string, values: any[]) {
  return await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=RAW`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    }
  );
}

export function GoogleCallback() {
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");

    if (accessToken) {
      console.log("OAuth access token:", accessToken);
      localStorage.setItem("google_access_token", accessToken);
      const returnTo = localStorage.getItem("oauth_return_to");
      if (returnTo) {
        window.location.href = returnTo;
      } else {
        window.location.href = "/";
      }
    }
  }, []);

  return null;
}

