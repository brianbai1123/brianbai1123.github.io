import type { NextConfig } from "next";

/** 用户站，发布在 https://brianbai1123.github.io/ 根路径 */
const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "cursor.sh",
    "*.cursor.sh",
    "cursor.com",
    "*.cursor.com",
    "cursorusercontent.com",
    "*.cursorusercontent.com",
    "null",
  ],
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
