/** @type {import('next').NextConfig} */

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Set basePath and assetPrefix for GitHub Pages deployment
  basePath: isGithubPages ? '/mmtc' : '',
  assetPrefix: isGithubPages ? '/mmtc/' : '',
};

module.exports = nextConfig;
