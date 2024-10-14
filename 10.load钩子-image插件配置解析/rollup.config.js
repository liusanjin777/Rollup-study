import image from "@rollup/plugin-image";

const buildOptions = {
  // 入口
  input: ["src/index.js"],
  output: {
    // 产物输出目录
    dir: "dist",
  },
  plugins: [
    image({
      dom: true,
    }),
  ],
};

export default buildOptions;
