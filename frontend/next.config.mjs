/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_BASE_URL: 'https://www.myclan.co.in' ,
      },
      typescript: {
        ignoreBuildErrors: true
      }
};

export default nextConfig;
