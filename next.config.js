const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public"
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*"
            }
        ]
    },
    experimental: {
        serverActions: {
            allowedOrigins: ["instagram.ldhdev.com"]
        }
    }
}

module.exports = withPWA(nextConfig)