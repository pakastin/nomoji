import { readdir, readFile, writeFile } from "fs/promises";

const results = {};

const files = await readdir("dist/svg");

for (const file of files) {
  if (!file.includes(".svg")) {
    continue;
  }
  const codes = file.split(".")[0].split("_");

  let traverse = results;

  for (const code of codes) {
    traverse[code] || (traverse[code] = {});
    traverse = traverse[code];
  }
}

writeFile(
  "dist/nomoji.js",
  `const emojis = ${JSON.stringify(results)};

export default function nomoji (txt, prefix) {
  let results = '';

  const chars = [];

  for (const char of txt) {
    chars.push([char, char.codePointAt(0).toString(16)]);
  }

  for (let i = 0; i < chars.length; i++) {
    let emoji = emojis;
    const [char, codePoint] = chars[i];

    const result = [];

    while (emoji[chars[i][1]]) {
      const [char, codePoint] = chars[i++];
      result.push(codePoint);
      emoji = emoji[codePoint];
    }

    if (result.length) {
      i--;
      results += '<img draggable="false" class="emoji" src="' + prefix + 'svg/' + result.join('_').toLowerCase() + '.svg">';
    } else {
      results += char;
    }
  }

  return results;
}
`,
  "utf8"
);
