import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow larger multipart payloads for admin file uploads (zip/video).
    proxyClientMaxBodySize: 60 * 1024 * 1024,
  },
};

export default nextConfig;
