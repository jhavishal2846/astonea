import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    serverActions: {
      // Match the Cloudflare Workers request-body ceiling (100 MB). Larger
      // than this isn't reachable from a browser-originated POST anyway.
      bodySizeLimit: '100mb',
    },
  },
  images: {
    loader: 'custom',
    loaderFile: './lib/images/cf-loader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.youngfuel.com' },
      { protocol: 'https', hostname: 'www.youngfuel.com' },
      { protocol: 'https', hostname: 'youngfuel.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
