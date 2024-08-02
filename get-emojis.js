import { access, writeFile } from "fs/promises";

const txt = await fetch(
  "https://unicode.org/Public/emoji/15.1/emoji-test.txt"
).then((res) => res.text());

const results = {};
const lines = txt.split("\n");

let done = 0;

for (const line of lines) {
  const percentage = Math.round((done++ / lines.length) * 100);
  if (line[0] === "#") {
    continue;
  }
  if (!line.trim()) {
    continue;
  }
  const emoji = line.split(";")[0].trim().split(" ").join("-").toUpperCase();

  const url = `https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/svg/${emoji}.svg`;

  const filename = `${emoji.split("-").join("_").toLowerCase()}.svg`;

  try {
    if (await exists(`./dist/svg/${filename}`)) {
      console.log(`${percentage}% Exists: ${filename}`);
    } else {
      const svg = await fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res.status} ${emoji}`);
          }
          return res;
        })
        .then((res) => res.text());

      await writeFile(`./dist/svg/${filename}`, svg, "utf8");
    }
  } catch (err) {
    console.error(`${percentage}% Error: ${filename}`);
  }
}

console.log("Done.");

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch (err) {
    return false;
  }
}
