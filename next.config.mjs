/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Configuração para lidar com o TypeORM no Next.js
    if (!isServer) {
      // Não tente carregar módulos específicos do servidor no cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        module: false,
        mysql: false,
        'react-native-sqlite-storage': false,
      };
    }

    // Evitar warnings de dependências críticas
    config.module.exprContextCritical = false;

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;