/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ['pino'],
  transpilePackages: ['@repo/ui'],
};

export default config;
