import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remarkGfm"],
  },
});

// GitHub Pages serves the site under /semantic, so the project-page build
// needs a base path. Cloudflare Workers serves from the domain root.
const isGitHubPages = process.env.GHPAGES === "1";

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { basePath: "/semantic" } : {}),
  experimental: {
    mdxRs: {
      mdxType: "gfm",
    },
  },
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        hostname: "localhost",
        protocol: "http",
      },
    ],
    unoptimized: true,
  },
  output: "export",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

export default withMDX(nextConfig);
