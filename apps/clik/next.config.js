/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    basePath: '/clik',
    assetPrefix: '/clik',

    async rewrites() {
        return [
            {
                source: '/ws/:path*',
                destination: 'https://api.wodah.com/ws/:path*',
            },
        ];
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: 'https://wodah.com',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
