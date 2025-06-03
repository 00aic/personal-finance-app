module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16, // 1rem = 16px（根据设计稿基准）
      unitPrecision: 5, // 转换后的小数位数
      propList: ['*'], // 需要转换的属性列表，* 表示全部
      selectorBlackList: [], // 忽略的选择器（如 .no-rem）
      replace: true, // 直接替换原值而非添加备用值
      mediaQuery: false, // 是否转换媒体查询中的 px
      minPixelValue: 2, // 小于 2px 不转换
      exclude: /node_modules/i, // 排除 node_modules 中的文件
    },
  },
}
