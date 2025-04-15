import nextra from "nextra";

const nextConfig = nextra({});

export default nextConfig({
    webpack: (config, { webpack }) => {
        config.plugins.push(
            new webpack.DefinePlugin({
                "import.meta.dirname": "__dirname",
            }),
        );
        return config;
    },
    transpilePackages: [
        "medfetch"
    ],
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
                    },
                ],
            },
        ];
    },
});
