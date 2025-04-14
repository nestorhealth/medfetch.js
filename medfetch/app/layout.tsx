import React from "react";

import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Providers } from "./Providers";
import "@/globals.css"
 
export const metadata = {}
 
const banner = <Banner storageKey="some-key">medfetch 1.0 is released 🎉</Banner>
const navbar = (
  <Navbar
    logo={<b>medfetch.js</b>}
    // ... Your additional navbar options
  />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>
 
export default async function RootLayout({ children }) {
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
      <body>
        <Providers>
          <Layout
            banner={banner}
            navbar={navbar}
            pageMap={await getPageMap()}
            docsRepositoryBase="https://github.com/bathan1/medfetch/tree/main"
            footer={footer}
          >
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  )
}
