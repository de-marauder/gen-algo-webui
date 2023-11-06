/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  distDir: 'dist'
}

module.exports = nextConfig