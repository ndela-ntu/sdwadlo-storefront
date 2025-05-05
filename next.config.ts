import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sdwadlo-bucket.s3.eu-west-1.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
