/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost'],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    async rewrites() {
        const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:4000'
        return [
            {
                source: '/api/:path*',
                destination: `${backendOrigin}/api/:path*`,
            },
        ]
    },
}

module.exports = nextConfig
