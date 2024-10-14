import MagicString from "magic-string";
import { createFilter } from "@rollup/pluginutils";

function escape(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

function ensureFunction(functionOrValue) {
  if (typeof functionOrValue === "function") return functionOrValue;
  return () => functionOrValue;
}

function longest(a, b) {
  return b.length - a.length;
}

function getReplacements(options) {
  if (options.values) {
    return Object.assign({}, options.values);
  }
  const values = Object.assign({}, options);
  delete values.delimiters;
  delete values.include;
  delete values.exclude;
  delete values.sourcemap;
  delete values.sourceMap;
  delete values.objectGuards;
  delete values.preventAssignment;
  return values;
}

function mapToFunctions(object) {
  return Object.keys(object).reduce((fns, key) => {
    const functions = Object.assign({}, fns);
    functions[key] = ensureFunction(object[key]);
    return functions;
  }, {});
}

const objKeyRegEx =
  /^([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)(\.([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*))+$/;
function expandTypeofReplacements(replacements) {
  Object.keys(replacements).forEach((key) => {
    const objMatch = key.match(objKeyRegEx);
    if (!objMatch) return;
    let dotIndex = objMatch[1].length;
    do {
      // eslint-disable-next-line no-param-reassign
      replacements[`typeof ${key.slice(0, dotIndex)}`] = '"object"';
      dotIndex = key.indexOf(".", dotIndex + 1);
    } while (dotIndex !== -1);
  });
}

export default function replace(options = {}) {
  const {
    delimiters = ["\\b", "\\b(?!\\.)"],
    preventAssignment,
    objectGuards,
  } = options;
  const replacements = getReplacements(options);
  if (objectGuards) expandTypeofReplacements(replacements);
  const functionValues = mapToFunctions(replacements);
  const keys = Object.keys(functionValues).sort(longest).map(escape);
  const lookbehind = preventAssignment ? "(?<!\\b(?:const|let|var)\\s*)" : "";
  const lookahead = preventAssignment ? "(?!\\s*=[^=])" : "";
  const pattern = new RegExp(
    `${lookbehind}${delimiters[0]}(${keys.join("|")})${
      delimiters[1]
    }${lookahead}`,
    "g"
  );

  return {
    name: "replace",

    transform(code, id) {
      // 去除边界处理，
      return executeReplacement(code, id);
    },
  };

  function executeReplacement(code, id) {
    const magicString = new MagicString(code);
    // 判断代码里是否有需要替换的部分，存在的话利用MagicString.overwrite替换掉
    // 返回false的时候跳过，交给下个插件处理
    if (!codeHasReplacements(code, id, magicString)) {
      return null;
    }
    const result = { code: magicString.toString() };
    // sourceMap处理
    if (isSourceMapEnabled()) {
      result.map = magicString.generateMap({ hires: true });
    }
    return result;
  }
  // 判断代码里是否有需要替换的部分，存在的话替换掉
  function codeHasReplacements(code, id, magicString) {
    // 定义是否匹配上
    let result = false;
    // 匹配后的数组
    let match;

    // pattern.exec(code) 将会匹配code中是否还有传入的要替换的字符target，不存在返回null，存在返回一个数组
    while ((match = pattern.exec(code))) {
      result = true;
      // code中包含target的起始索引
      const start = match.index;
      // code中包含target的最终索引
      const end = start + match[0].length;
      // 替换后值
      const replacement = String(functionValues[match[1]](id));
      // 替换
      magicString.overwrite(start, end, replacement);
    }
    return result;
  }

  function isSourceMapEnabled() {
    return options.sourceMap !== false && options.sourcemap !== false;
  }
}
