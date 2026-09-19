/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['playwright-core', '@sparticuz/chromium'],
  outputFileTracingIncludes: {
    '/api/quotations': [
      './public/logo.png',
      './node_modules/@fontsource/noto-sans-arabic/files/*arabic-400-normal.woff2',
      './node_modules/@fontsource/noto-sans-arabic/files/*arabic-700-normal.woff2',
      './node_modules/@sparticuz/chromium/bin/**',
    ],
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
