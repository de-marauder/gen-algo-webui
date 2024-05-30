/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  output: "standalone",
  reactStrictMode: true,
}

module.exports = nextConfig
