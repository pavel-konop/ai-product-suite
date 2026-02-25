import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" }, // Google avatars
      { hostname: "avatars.githubusercontent.com" }, // GitHub avatars
    ],
  },
};

export default nextConfig;
