import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yfscfmjqgmrkcrcxtjfc.supabase.co',
        pathname: '/storage/v1/object/public/**', // Allow all images from this path
      },
    ],
  },
};

export default nextConfig;
