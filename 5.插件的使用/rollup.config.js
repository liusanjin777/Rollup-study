import { visualizer } from "rollup-plugin-visualizer";

const buildOptions = {
  // 入口
  input: ["src/index.js"],
  // 出口  可以为数组或者对象
  // 配置成数组，数组中每个元素都是一个描述对象
  output: {
    // 产物输出目录
    dir: "dist/output",
    // 以下三个配置项都可以使用这些占位符:
    // 1. [name]: 去除文件后缀后的文件名
    // 2. [hash]: 根据文件名和文件内容生成的 hash 值
    // 3. [format]: 产物模块格式，如 es、cjs
    // 入口模块的输出文件名
    entryFileNames: `[name]-[hash].js`,
    // 非入口模块(如动态 import)的输出文件名
    chunkFileNames: "chunk-[hash].js",
    // 静态资源文件输出文件名
    // [extname]: 产物后缀名(带`.`)
    assetFileNames: "assets/[name]-[hash][extname]",
    // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
    format: "cjs",
    // 是否生成 sourcemap 文件
    sourcemap: true,
    // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
    // name: "MyBundle",
    // 全局变量声明
    globals: {
      // 项目中可以直接用`$`代替`jquery`
      jquery: "$",
    },
    plugins: [
      // 将 visualizer 插件放到最后
      visualizer(),
    ],
  },
};

export default buildOptions;
