const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/image2pdf/' : '',
  basePath: isProd ? '/image2pdf' : '',
  output: 'export'
};

export default nextConfig;