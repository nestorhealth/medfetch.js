import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { ReactNode } from "react";
import "@/app/globals.css";
import "nextra-theme-docs/style.css";
import { Providers } from "@/app/Providers";

export const metadata = {};

const banner = (
  <Banner storageKey="some-key">medfetch 0.1.0 is released 🎉</Banner>
);
const navbar = (
  <Navbar
    logo={<b>Medfetch.js</b>}
    // ... Your additional navbar options
  />
);
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>;

export default async function DocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body suppressHydrationWarning>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/nestorhealth/medfetch.js/tree/main/docs"
          footer={footer}
        >
          <Providers>{children}</Providers>
        </Layout>
      </body>
    </html>
  );
}
