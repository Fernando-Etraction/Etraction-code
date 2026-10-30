const fs = require("fs"), path = require("path");
const base = process.argv[2], codesDir = process.argv[3];
const tpl = fs.readFileSync(path.join(base, "mural-template.html"), "utf8");
const imgs = {};
for (const f of fs.readdirSync(path.join(base, "img")).filter(f => f.endsWith(".webp")).sort()) {
  imgs[path.basename(f, ".webp")] = "data:image/webp;base64," + fs.readFileSync(path.join(base, "img", f)).toString("base64");
}
const codes = {};
if (codesDir) for (const f of fs.readdirSync(codesDir).filter(f => /^\d-.*\.js$/.test(f)).sort()) {
  const src = fs.readFileSync(path.join(codesDir, f), "utf8");
  new Function(src);
  codes[f] = src;
}
const safe = o => JSON.stringify(o).replace(/<\//g, "<\/");
let out = tpl.replace("/*__IMG__*/", "var IMG=" + safe(imgs) + ";").replace("/*__CODES__*/", "var CODES=" + safe(codes) + ";");
if (out.includes("/*__")) throw new Error("placeholder left");
fs.writeFileSync(path.join(base, "mural-cro-ultramel.html"), out);
new Function(out.match(/<script>([\s\S]*)<\/script>/)[1]);
console.log(Object.keys(imgs).length, "imagens,", Object.keys(codes).length, "códigos,", Math.round(Buffer.byteLength(out) / 1024), "KB, script ok");
