/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3001' ,
      },
      typescript: {
        ignoreBuildErrors: true
      }
};

export default nextConfig;
