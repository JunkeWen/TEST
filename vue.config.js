const pages = require('./build/pages')

module.exports = {
  publicPath: './',
  assetsDir: 'assets',
  pages: pages,
  productionSourceMap: false, // 是否生成sourceMap文件
  devServer: {
    //open: true, // 启动服务后是否打开浏览器    'http://localhost:8086/prj-nchm/',
    proxy: {
      '/test': {
        target: 'http://localhost:8086/prj-nchm/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/test': ''
        }
      }
    }
  },
}
