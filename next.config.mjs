const quotationRuntimeFiles = [
  './public/logo.png',
  './node_modules/@fontsource/noto-sans-arabic/files/*arabic-400-normal.woff2',
  './node_modules/@fontsource/noto-sans-arabic/files/*arabic-700-normal.woff2',
  './node_modules/playwright-core/**',
  './node_modules/@sparticuz/chromium/bin/**',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['playwright-core', '@sparticuz/chromium'],
  outputFileTracingIncludes: {
    '/api/quotations': quotationRuntimeFiles,
    '/api/quotations/**/*': quotationRuntimeFiles,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
