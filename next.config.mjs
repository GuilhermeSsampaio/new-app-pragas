// Importações necessárias
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";
import withPWA from "next-pwa";

// Configuração do Next.js
const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  sassOptions: {
    includePaths: [path.join(process.cwd(), "styles")],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};

// Configuração do Sentry
const sentryOptions = {
  silent: true,
  org: "tecnofam",
  project: "pwa",
  url: "https://bug.embrapa.io/",
};

const sentryConfig = {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

const nextConfigWithSentry = withSentryConfig(
  nextConfig,
  sentryOptions,
  sentryConfig,
);

// Configuração do PWA
const pwaConfig = {
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
};

const nextConfigWithPWA = withPWA(pwaConfig)(nextConfigWithSentry);

// Export the combined configuration for Next.js with PWA support
export default nextConfigWithPWA;
