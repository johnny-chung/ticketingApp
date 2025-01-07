/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Create a shallow copy of watchOptions
    config.watchOptions = {
      ...config.watchOptions,
      poll: 300,
    };
    return config;
  },
};

export default nextConfig;
