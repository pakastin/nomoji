import { stat, writeFile } from "fs/promises";

const url = "https://unicode.org/Public/emoji/16.0/emoji-test.txt";

const response = await fetch(url);

if (!response.ok) {
  console.error(response.status);
  throw new Error(await response.text());
}

const txt = await response.text();

const results = [];
const lines = txt.split("\n");

let group;
let subgroup;

const components = {};

for (const line of lines) {
  if (line[0] === "#") {
    if (line.startsWith("# group:")) {
      group = line.split(": ")[1].trim();
    }
  } else {
    if (group === "Component") {
      const code = line.split(";")[0].trim();
      if (code) {
        components[code] = true;
      }
    }
  }
}

for (const line of lines) {
  if (line[0] === "#") {
    if (line.startsWith("# group")) {
      group = line.split(": ")[1];
      if (group === "Component") {
        continue;
      }
      results.push({ type: "Group", name: group, subgroups: [] });
    } else if (line.startsWith("# subgroup")) {
      subgroup = line.split(": ")[1];
      if (group === "Component") {
        continue;
      }
      results[results.length - 1].subgroups.push({
        type: "Subgroup",
        name: subgroup,
        emojis: [],
      });
    }
  } else if (line.trim()) {
    if (group === "Component") {
      continue;
    }
    const emoji = line.split(";")[0].trim().split(" ").join("-").toUpperCase();

    let variant = false;

    for (const code of emoji.split("-")) {
      if (components[code]) {
        variant = true;
      }
    }

    const filename = `${emoji.split("-").join("_").toLowerCase()}.svg`;
    const exists = await stat(`dist/svg/${filename}`).catch((err) => {});
    if (exists) {
      const description = line.split("#")[1].split(" ").slice(3).join(" ");

      const group = results[results.length - 1];

      if (variant) {
        const emojis = group.subgroups[group.subgroups.length - 1].emojis;

        emojis[emojis.length - 1].variants.push({
          filename,
          description,
        });
      } else {
        group.subgroups[group.subgroups.length - 1].emojis.push({
          filename,
          description,
          variants: [],
        });
      }
    }
  }
}
writeFile(
  "dist/meta.js",
  `const emojiGroups = ${JSON.stringify(results, null, 2)}`
);
writeFile("dist/meta.json", JSON.stringify(results, null, 2));

const emojiCodes = {};

for (const group of results) {
  for (const subgroup of group.subgroups) {
    for (const emoji of subgroup.emojis) {
      const codes = emoji.filename.split(".")[0].split("_");

      let traverse = emojiCodes;

      for (const code of codes) {
        traverse[code] || (traverse[code] = {});
        traverse = traverse[code];
      }
      for (const variant of emoji.variants) {
        const codes = variant.filename.split(".")[0].split("_");

        let traverse = emojiCodes;

        for (const code of codes) {
          traverse[code] || (traverse[code] = {});
          traverse = traverse[code];
        }
      }
    }
  }
}

writeFile(
  "emojicodes.js",
  `export default ${JSON.stringify(emojiCodes, null, 2)}`
);
