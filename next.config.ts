const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  serverExternalPackages: ["@sparticuz/chromium"],

  // 🔥 ESSA LINHA É CRÍTICA
  outputFileTracingIncludes: {
    "/api/share-image": [
      "./node_modules/@sparticuz/chromium/**/*",
    ],
  },
};

export default nextConfig;