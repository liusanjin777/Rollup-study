import replace from "@rollup/plugin-replace";

const buildOptions = {
  // 入口
  input: ["src/index.js"],
  output: {
    // 产物输出目录
    dir: "dist",
  },
  plugins: [
    replace({
      __test__: 1,
    }),
  ],
};

export default buildOptions;
