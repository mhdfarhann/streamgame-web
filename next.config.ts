import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['overlaygame.site', 'socket.overlaygame.site'],
};

export default nextConfig;