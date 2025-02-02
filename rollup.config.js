import html from "@rollup/plugin-html";

const buildOptions = {
  // 入口
  input: ["src/index.js"],
  output: {
    // 产物输出目录
    dir: "dist",
  },
  plugins: [html()],
};

export default buildOptions;
