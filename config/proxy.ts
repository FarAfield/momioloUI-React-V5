export default {
  dev: {
    '/base': {
      target: 'http://localhost:8080/base',
      changeOrigin: true,
      pathRewrite: { '/base': '' },
    },
  },
  pre: {
    '/base': {
      target: 'https://www.momiolo.com:4430/base',
      changeOrigin: true,
      pathRewrite: { '/base': '' },
    },
  },
};
