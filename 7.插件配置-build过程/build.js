const rollup = require("rollup");

const util = require("util");

const build = async () => {
  const bundle = await rollup.rollup({
    input: ["./src/index.js"],
  });
  console.log(
    util.inspect(bundle, { showHidden: false, depth: null, colors: true })
  );
};

build();
