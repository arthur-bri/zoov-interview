module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        import: ['~@zoov/design-system/src/styles/components'],
      },
    },
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule.use('svg-inline-loader').loader('svg-inline-loader').end();
  },
};
