/** @type {import('next').NextConfig} */
// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Ensure SWC minification is enabled
  experimental: {
    forceSwcTransforms: true, // Forçar o uso do SWC para transformação
  },
};

export default nextConfig;
