/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "cdn-icons-png.flaticon.com" },
      { hostname: "utfs.io" },
      { hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
