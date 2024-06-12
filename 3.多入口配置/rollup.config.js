// ---------------多入口
// const buildOptions = {
//   // 入口
//   input: ["src/index.js", "src/util.js"],
//   // 出口  可以为数组或者对象
//   // 配置成数组，数组中每个元素都是一个描述对象
//   output: [
//     {
//       // 产物输出目录
//       dir: "dist/esModule",
//       // 产物输出格式
//       format: "esm",
//     },
//     {
//       // 产物输出目录
//       dir: "dist/commonjs",
//       // 产物输出格式
//       format: "cjs",
//     },
//   ],
// };

// export default buildOptions;

// ----------------不同的入口对应不同的产物
const buildESMOptions = {
  input: ["src/index.js"],
  output: {
    // 产物输出目录
    dir: "dist/esModule",
    // 产物输出格式
    format: "esm",
  },
};
const buildCJSOptions = {
  input: ["src/util.js"],
  output: {
    // 产物输出目录
    dir: "dist/commonjs",
    // 产物输出格式
    format: "cjs",
  },
};

export default [buildESMOptions, buildCJSOptions];
