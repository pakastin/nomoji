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

for (const line of lines) {
  if (line[0] === "#") {
    if (line.startsWith("# group")) {
      group = line.split(": ")[1];
      results.push({ type: "Group", name: group, subgroups: [] });
    } else if (line.startsWith("# subgroup")) {
      subgroup = line.split(": ")[1];
      results[results.length - 1].subgroups.push({
        type: "Subgroup",
        name: subgroup,
        emojis: [],
      });
    }
  } else if (line.trim()) {
    const emoji = line.split(";")[0].trim().split(" ").join("-").toUpperCase();

    const filename = `${emoji.split("-").join("_").toLowerCase()}.svg`;
    const exists = await stat(`dist/svg/${filename}`).catch((err) => {});
    if (exists) {
      const description = line.split("#")[1].split(" ").slice(3).join(" ");

      const group = results[results.length - 1];
      group.subgroups[group.subgroups.length - 1].emojis.push({
        filename,
        description,
      });
    }
  }
}

writeFile("dist/meta.json", JSON.stringify(results, null, 2));
