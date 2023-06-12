/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/pre-stop',
        destination: '/api/pre-stop',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
