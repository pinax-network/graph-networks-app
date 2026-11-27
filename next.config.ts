import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The Kubernetes image (Dockerfile) sets NEXT_OUTPUT=standalone to get a
  // self-contained server.js.
  ...(process.env.NEXT_OUTPUT === 'standalone' ? { output: 'standalone' as const } : {}),
  // This is a standalone app: ignore lockfiles in parent directories, which
  // would otherwise nest server.js under their path in the standalone output.
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
};

export default nextConfig;
