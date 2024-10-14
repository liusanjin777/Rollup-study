import alias from "@rollup/plugin-alias";

const buildOptions = {
  // 入口
  input: ["src/index.js"],
  output: {
    // 产物输出目录
    dir: "dist",
  },
  plugins: [
    // 打包时将import { xx } from 'utils' 解析为 import { xx } from './util'
    alias({
      entries: [{ find: "utils", replacement: "./util" }],
    }),
  ],
};

export default buildOptions;
