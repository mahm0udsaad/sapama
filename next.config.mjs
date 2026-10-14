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
  // The home page is the owner's static landing page (public/home.html, styles.css, script.js, assets/).
  async rewrites() {
    return {
      beforeFiles: [{ source: '/', destination: '/home.html' }],
    }
  },
  async redirects() {
    return [{ source: '/home.html', destination: '/', permanent: true }]
  },
}

export default nextConfig
