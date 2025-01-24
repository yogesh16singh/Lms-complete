/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'randomuser.me'], // List of allowed image domains
  },
};

module.exports = nextConfig;
