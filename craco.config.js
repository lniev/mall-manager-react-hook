const CracoLessPlugin = require('craco-less');
const path = require('path');
const resolve = (dir) => path.resolve(__dirname, dir);
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1890ff' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@': resolve('src'),
      'components': resolve('src/components'),
      'store': resolve('src/store'),
      'assets': resolve('src/assets'),
      'common': resolve('src/common'),
      'services': resolve('src/services'),
      'pages': resolve('src/pages'),
      'untils': resolve('src/untils'),
      'router': resolve('src/router'),
      '~': resolve('node_modules'),
    },
  },
};