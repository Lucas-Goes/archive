const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // 🔥 IMPORTANTE PRA PUPPETEER
  serverExternalPackages: ["@sparticuz/chromium"],
};

export default nextConfig;