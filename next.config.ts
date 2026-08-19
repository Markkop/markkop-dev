import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production'

const securityPolicy = [
  "default-src 'self'",
  "connect-src 'self' https://api.github.com",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src 'self' https://*.markkop.dev https://habitchain.xyz https://*.habitchain.xyz",
  "frame-ancestors 'none'",
  isProduction ? 'upgrade-insecure-requests' : '',
].filter(Boolean).join('; ')

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'www.markkop.dev' }],
        destination: 'https://markkop.dev',
        permanent: true,
      },
      {
        source: '/:path+',
        has: [{ type: 'host', value: 'www.markkop.dev' }],
        destination: 'https://markkop.dev/:path+',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/favicon.ico', destination: '/brand-icon.png' },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: securityPolicy
          }
        ]
      },
      // Aggressive caching for static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isProduction ? 'public, max-age=31536000, immutable' : 'no-store',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isProduction ? 'public, max-age=31536000, immutable' : 'no-store',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: isProduction ? 'public, max-age=31536000, immutable' : 'no-store',
          },
        ],
      },
    ]
  },
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
