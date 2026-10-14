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
    return [
      { source: '/home.html', destination: '/', permanent: true },
      // The product catalog was removed; old product URLs (/products/<store-slug>-p<id>) go to the same product in the store.
      { source: '/products/:slug-p:id(\\d+)', destination: 'https://madmakvision.com/:slug/p:id', permanent: true },
      { source: '/products/:path*', destination: 'https://madmakvision.com/', permanent: true },
      { source: '/categories/:path*', destination: 'https://madmakvision.com/', permanent: true },
    ]
  },
}

export default nextConfig
