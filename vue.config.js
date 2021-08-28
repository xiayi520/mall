module.exports = {
  configureWebpack: {
    // resolve解决路径相关的问题
    resolve: {
      // extensions: [],
      alias: {
        // '@': 'src' // 脚手架3内部已经默认配置了，不用重新配置
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}