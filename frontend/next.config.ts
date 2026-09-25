import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api",
                destination: "https://adhdtest-api.vercel.app",
            },
            {
                source: "/api/:path*",
                destination: "https://adhdtest-api.vercel.app/:path*",
            },
        ];
    },
};

export default nextConfig;