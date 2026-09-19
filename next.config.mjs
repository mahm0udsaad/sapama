/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['playwright-core'],
  images: {
    unoptimized: true,
  },
}

export default nextConfig
