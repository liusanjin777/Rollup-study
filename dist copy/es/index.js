// 代码已经打包到了一起
const foo = (name) => {
  console.log(`foo - ${name}`);
};

foo("rollup");

// 自动treeshaking将不需要的函数（bar）去除
