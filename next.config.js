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

module.exports = nextConfig
