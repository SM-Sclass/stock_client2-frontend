import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'", 
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
              "img-src 'self' data: https:", // Allows external images
              "connect-src 'self' https://www.backend.algotrading.live https://cdn.jsdelivr.net",
              "font-src 'self' https:",      // Allows Google Fonts etc.
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-src 'none'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",   // Forces HTTP urls to load over HTTPS
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;