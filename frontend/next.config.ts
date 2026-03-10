import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Cho phép tất cả các domain (Dùng tạm khi dev)
      },
      // Hoặc cấu hình cụ thể cho an toàn:
      // {
      //   protocol: 'https',
      //   hostname: '.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
