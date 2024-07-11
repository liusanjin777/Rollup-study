const rollup = require("rollup");

const build = async () => {
  const bundle = await rollup.rollup({
    input: ["./src/index.js"],
  });
  const res = await bundle.generate({
    format: "es",
  });

  console.log(res);
};

build();
