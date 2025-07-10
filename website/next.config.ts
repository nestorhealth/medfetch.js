import nextra from "nextra";

const nextConfig = nextra({
  contentDirBasePath: "/docs",
});

export default nextConfig({
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "import.meta.dirname": "__dirname",
      }),
    );
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*?)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          }
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  }
});
