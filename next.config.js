/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  // For pure CSR, we'll build normally but deploy as static files
  // The server can serve the built files without Next.js server
  trailingSlash: true,
  output: 'export',
  // Disable features that require server-side rendering
  experimental: {
    // Optimize for client-side rendering
  },
}

module.exports = nextConfig