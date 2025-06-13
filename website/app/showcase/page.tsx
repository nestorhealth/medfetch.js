"use client";
import Link from "next/link";

export default function Showcase() {
  return (
    <main>
      <div>
        <h1>Welcome to the Showcase page</h1>
        <p>
          Here are some examples of using Medfetch in a web app
        </p>
        <ol>
          <li>
            <Link href="/showcase/researcher">
              Researcher Spreadsheet
            </Link>
          </li>
        </ol>
      </div>
    </main>
  );
}
