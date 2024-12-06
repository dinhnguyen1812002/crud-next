/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],  // Thêm cấu hình cho phép ảnh từ localhost
  },
};

export default nextConfig;
