const { Bootstrap } = require('@midwayjs/bootstrap');

// 显式配置并运行，替代原来的直接 Bootstrap.run()
Bootstrap.configure({
  // 引入编译后的入口文件（TypeScript 编译后默认输出到 dist 目录）
  imports: require('./dist/index'),
  // 禁用依赖注入的目录扫描（单文件构建模式必需）
  moduleDetector: false,
}).run();