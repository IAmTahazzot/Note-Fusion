/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['img.clerk.com', 'files.edgestore.dev'],
    },
}

module.exports = nextConfig
