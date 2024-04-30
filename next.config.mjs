/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // webpack: (config) => {
    //     let modularizeImports = null;
    //     config.module.rules.some((rule) =>
    //       rule.oneOf?.some((oneOf) => {
    //         modularizeImports =
    //           oneOf?.use?.options?.nextConfig?.modularizeImports;
    //         return modularizeImports;
    //       }),
    //     );
    //     if (modularizeImports?.["@headlessui/react"])
    //       delete modularizeImports["@headlessui/react"];
    //     return config;
    //   },
    image: {
        domains: ["lh3.googleusercontent.com", "res.cloudinary.com"]
    }
};

export default nextConfig;
