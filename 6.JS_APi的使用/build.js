const rollup = require("rollup");

const inputOptions = {
  input: "./src/index.js",
  external: [],
  plugins: [],
};

const outputOptionsList = [
  {
    // 产物输出目录
    dir: "dist/esModule",
    // 产物输出格式
    format: "esm",
  },
  {
    // 产物输出目录
    dir: "dist/commonjs",
    // 产物输出格式
    format: "cjs",
  },
];

(async function () {
  let bundle;
  let buildFaild = false;
  try {
    bundle = await rollup.rollup(inputOptions);
    for (let index = 0; index < outputOptionsList.length; index++) {
      const outputOptions = outputOptionsList[index];
      await bundle.generate(outputOptions);
      await bundle.write(outputOptions);
    }
  } catch (error) {
    console.log(error);
    buildFaild = true;
  }
})();
