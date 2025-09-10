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

function nomoji(txt, prefix, noSanitation) {
  let results = "";

  const replaceChars = ["<", ">", "?", "&", "=", ";", ":", '"', "'"].reduce(
    (lookup, char) => {
      lookup[char] = true;
      return lookup;
    },
    {}
  );

  const chars = [];

  for (const char of txt) {
    const codePoint = char.codePointAt(0).toString(16);
    chars.push([char, codePoint]);
  }

  for (let i = 0; i < chars.length; i++) {
    let emoji = emojis;
    const [char, codePoint] = chars[i];

    const result = [];

    while (emoji[chars[i]?.[1]]) {
      const [char, codePoint] = chars[i++];
      result.push(codePoint);
      emoji = emoji[codePoint];
    }

    if (result.length) {
      results += `<img draggable="false" class="emoji" src="${prefix}svg/${result
        .join("_")
        .toLowerCase()}.svg">`;
      i--;
    } else {
      if (!noSanitation && replaceChars[char]) {
        results += `&#${char.charCodeAt(0)};`;
      } else {
        results += char;
      }
    }
  }

  return results;
}

const codeES = `const emojis = ${JSON.stringify(results)};

export default ${nomoji.toString()}
`;

const codeJS = `((self) => {
  const emojis = ${JSON.stringify(results)};

  ${nomoji.toString()}

  self.nomoji = nomoji;
})(window || globalThis);
`;

const codeCJS = `const emojis = ${JSON.stringify(results)};

module.exports = ${nomoji.toString()}
`;

writeFile("nomoji.js", codeES, "utf8");
writeFile("nomoji.cjs", codeCJS, "utf8");
writeFile("dist/nomoji.js", codeJS, "utf8");
