/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["src", "__tests__"],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    webpackMemoryOptimizations: true,
    typedEnv: true,
  },
  compiler: {
    removeConsole:
      process.env.APP_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nos.wjv-1.neo.id",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
};

module.exports = nextConfig;
