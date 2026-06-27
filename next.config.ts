import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Wires getCloudflareContext() so `next dev` (turbopack) can see Worker
// bindings — including the local D1 file at
// .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite — without
// having to use `wrangler dev`. Reads `wrangler.jsonc` for the binding set.
initOpenNextCloudflareForDev();

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
    // Cloudflare Image Resizing (which the `cf-loader.ts` custom loader
    // targets) requires the Workers Paid plan. On the free plan, leave
    // `unoptimized: true` so <Image> falls back to a plain <img src=...>
    // and the browser fetches the asset directly.
    //
    // To re-enable on paid plan: remove `unoptimized`, add
    //   loader: 'custom',
    //   loaderFile: './lib/images/cf-loader.ts',
    // and confirm Cloudflare Images is enabled for the zone.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.youngfuel.com' },
      { protocol: 'https', hostname: 'www.youngfuel.com' },
      { protocol: 'https', hostname: 'youngfuel.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
