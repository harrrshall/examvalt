/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/study_materials',
        destination: '/dashboard',
      },
      {
        source: '/subscription',
        destination: '/dashboard',
      },
      {
        source: '/payment',
        destination: '/payment',
      },
    ];
  },
};

export default nextConfig;