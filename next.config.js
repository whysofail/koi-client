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
  output: "standalone",
};

module.exports = nextConfig;
