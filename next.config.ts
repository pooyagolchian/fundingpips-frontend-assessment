import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
    typescript: {
        // I added for vercel deployment
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
