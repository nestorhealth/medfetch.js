"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { sql2 } from "@/lib/client";
import {
  createSpreadsheet,
  googleRedirectURI,
  writeToSpreadsheet,
} from "@/lib/google.oauth2";

export function ExportDatasetToSheets() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("google_access_token");
    if (stored) {
      setToken(stored);
    }
  }, []);

  const redirectToAuth = () => {
    localStorage.setItem("oauth_return_to", window.location.href);
    const authWindow = window.open(
      googleRedirectURI(),
      "_blank",
      "popup, width=500,height=600",
    );

    const poll = setInterval(() => {
      const token = localStorage.getItem("google_access_token");
      if (token) {
        authWindow?.close();
        setToken(token);
        clearInterval(poll);
      }
    }, 1000);
  };

  const handleExport = async () => {
    if (!token) {
      alert("No access token found.");
      return;
    }

    try {
      const rows = await sql2<{
        condition_id: string;
        condition_duration: string;
        procedure_code: string;
        procedure_display: string;
      }>`select * from ab_dataset;`;

      if (!rows.length) {
        alert("No data to export.");
        return;
      }

      const values = [Object.keys(rows[0]), ...rows.map(Object.values)];

      const sheetsName = prompt("Name your new Google Sheet:", "ab_dataset");
      if (!sheetsName || sheetsName.length === 0) {
        alert(`Export cancelled: can't write that filename ${sheetsName}`);
        return;
      }
      const sheetId = await createSpreadsheet(token, sheetsName);
      const writeRes = await writeToSpreadsheet(token, sheetId, values);
      if (!writeRes.ok) throw new Error(await writeRes.text());
      alert("Exported to new Google Sheet! 🚀");
      window.open(
        `https://docs.google.com/spreadsheets/d/${sheetId}`,
        "_blank",
      );
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data.");
    }
  };

  return token ? (
    <Button onClick={handleExport}>Export to Google Sheets</Button>
  ) : (
    <Button onClick={redirectToAuth}>Sign in with Google</Button>
  );
}
