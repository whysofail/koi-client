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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nos.wjv-1.neo.id",
        port: "",
        pathname: "/**", // Allows any path under the given hostname
      },
    ],
  },
  output: "standalone",
};

module.exports = nextConfig;
