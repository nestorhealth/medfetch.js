import Link from "next/link";

export default function IndexPage() {
  return (
    <main>
      <h1>Data fetching made easy with Medfetch</h1>
      <p>This page is under construction. Here are some working links:</p>
      <ol>
        <li>
          <Link href={process.env.NEXT_PUBLIC_API_URL! + "/docs"} target="_blank">
          Documentation
          </Link>
        </li>
        <li>
          <Link href="/showcase">
          Showcase
          </Link>
        </li>
      </ol>
    </main>
  );
}