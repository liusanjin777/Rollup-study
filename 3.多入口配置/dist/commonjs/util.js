'use strict';

const foo = (name) => {
  console.log(`foo - ${name}`);
};

const bar = (name) => {
  console.log(`bar - ${name}`);
};

exports.bar = bar;
exports.foo = foo;
