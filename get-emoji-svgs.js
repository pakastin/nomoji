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
  const emoji = line.split(";")[0].trim().split(" ").join("_").toLowerCase();

  const url = `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_u${emoji}.svg`;

  try {
    const svg = await fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${emoji}`);
        }
        return res;
      })
      .then((res) => res.text());

    await writeFile(`./svg/${emoji}.svg`, svg, "utf8");
  } catch (err) {
    console.error(err);
  }
}
