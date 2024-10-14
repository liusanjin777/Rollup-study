import { readFileSync } from "fs";
import { extname } from "path";

import { createFilter } from "@rollup/pluginutils";
import svgToMiniDataURI from "mini-svg-data-uri";

const defaults = {
  dom: false,
  exclude: null,
  include: null,
};

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const domTemplate = ({ dataUri }) => `
  var img = new Image();
  img.src = "${dataUri}";
  export default img;
`;

const constTemplate = ({ dataUri }) => `
  var img = "${dataUri}";
  export default img;
`;

const getDataUri = ({ format, isSvg, mime, source }) =>
  isSvg ? svgToMiniDataURI(source) : `data:${mime};${format},${source}`;

export default function image(opts = {}) {
  const options = Object.assign({}, defaults, opts);
  const filter = createFilter(options.include, options.exclude);

  return {
    name: "image",

    load(id) {
      if (!filter(id)) {
        return null;
      }
      // 是否为图片，不是图片的时候跳过，交给下一个插件处理
      const mime = mimeTypes[extname(id)];
      if (!mime) {
        // not an image
        return null;
      }

      this.addWatchFile(id);
      // 是否为svg格式
      const isSvg = mime === mimeTypes[".svg"];
      // 编码格式
      const format = isSvg ? "utf-8" : "base64";
      // 获取图片内容，移除所有的换行符、回车符
      const source = readFileSync(id, format).replace(/[\r\n]+/gm, "");
      // 非svg类型生成base64， svg类型生成对应的uri
      const dataUri = getDataUri({ format, isSvg, mime, source });
      const code = options.dom
        ? // 生成dom中可用的代码
          domTemplate({ dataUri })
        : // 将base64设置成一个const变量
          constTemplate({ dataUri });

      return code.trim();
    },
  };
}
