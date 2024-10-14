export default function alias(options) {
  // 获取入口文件
  const entries = getEntries(options);
  // 未获取到入口文件，直接跳过
  if (entries.length === 0) {
    return {
      name: "alias",
      resolveId: () => null,
    };
  }

  return {
    name: "alias",
    async buildStart(inputOptions) {
      /* 省略 */
    },
    /**
     *
     * @param {*} importee 当前模块路径  import { foo } from "utils" 中的 utils
     * @param {*} importer 引用当前模块路经 引用b的文件路径，此处为/src/index.js
     * @param {*} resolveOptions 其余参数
     * @returns
     */
    resolveId(importee, importer, resolveOptions) {
      // 是否能匹配到路径
      const matchedEntry = entries.find((entry) =>
        matches(entry.find, importee)
      );
      // 匹配不到直接跳过
      if (!matchedEntry) {
        return null;
      }
      // 将当前模块路径替换, 获取替换后的路径：updatedId
      const updatedId = importee.replace(
        matchedEntry.find,
        matchedEntry.replacement
      );
      // resolverFunction对应选项中的customResolver，自定义的路径解析算法
      if (matchedEntry.resolverFunction) {
        return matchedEntry.resolverFunction.call(
          this,
          updatedId,
          importer,
          resolveOptions
        );
      }
      // 每个插件执行时都会绑定一个上下文对象作为 this
      // this.resolve 并发调用其他插件的reolveId钩子函数
      return this.resolve(
        updatedId,
        importer,
        Object.assign({ skipSelf: true }, resolveOptions)
      ).then((resolved) => {
        // 其他插件处理了路径则返回其他插件处理后的结果
        if (resolved) return resolved;

        if (!path.isAbsolute(updatedId)) {
          this.warn(
            `rewrote ${importee} to ${updatedId} but was not an abolute path and was not handled by other plugins. ` +
              `This will lead to duplicated modules for the same path. ` +
              `To avoid duplicating modules, you should resolve to an absolute path.`
          );
        }
        // 否则直接返回替换后的路径 updatedId
        return { id: updatedId };
      });
    },
  };
}
