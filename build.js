import { readFile, writeFile } from "fs/promises";

const txt = await readFile("./emojis.txt", "utf8");

const results = {};
const lines = txt.split("\n");

for (const line of lines) {
  if (line[0] === "#") {
    continue;
  }
  if (!line.trim()) {
    continue;
  }
  const codes = line.split(";")[0].trim().split(" ");

  let traverse = results;

  for (const code of codes) {
    traverse[code] || (traverse[code] = {});
    traverse = traverse[code];
  }
}

writeFile(
  "dist/nomoji.js",
  `const emojis = ${JSON.stringify(results)};

export default function nomoji (txt) {
  let results = '';

  const chars = [];

  for (const char of txt) {
    chars.push([char, char.codePointAt(0).toString(16).toUpperCase()]);
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
      results += '<img draggable="false" class="emoji" src="svg/' + result.join('_').toLowerCase() + '.svg">';
    } else {
      results += char;
    }
  }

  return results;
}
`,
  "utf8"
);
