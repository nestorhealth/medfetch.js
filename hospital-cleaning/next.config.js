/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move these out of experimental
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Keep other experimental features
  experimental: {
    serverComponentsExternalPackages: ['openai']
  },

  // Environment variables
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY
  }
}

module.exports = nextConfig 