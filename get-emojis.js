import { access, writeFile } from "fs/promises";

const source = "noto" || "openmoji";

const txt = await fetch(
  "https://unicode.org/Public/emoji/16.0/emoji-test.txt"
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

  const url =
    source === "noto"
      ? `https://raw.githubusercontent.com/googlefonts/noto-emoji/refs/heads/main/svg/emoji_u${emoji
          .split("-")
          .join("_")
          .toLowerCase()}.svg`
      : `https://raw.githubusercontent.com/hfg-gmuend/openmoji/refs/heads/master/color/svg/${emoji}.svg`;

  const url2 =
    source === "noto"
      ? `https://raw.githubusercontent.com/googlefonts/noto-emoji/refs/heads/main/third_party/region-flags/waved-svg/emoji_u${emoji
          .split("-")
          .join("_")
          .toLowerCase()}.svg`
      : null;

  const filename = `${emoji.split("-").join("_").toLowerCase()}.svg`;

  if (await exists(`./dist/svg/${filename}`)) {
    console.log(`${percentage}% Exists: ${filename}`);
  } else {
    try {
      const svg = await fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res.status} ${emoji}`);
          }
          return res;
        })
        .then((res) => res.text());

      await writeFile(`./dist/svg/${filename}`, svg, "utf8");
    } catch (err) {
      console.error(`${percentage}% Error: ${url}`);
      if (url2) {
        try {
          const svg = await fetch(url2)
            .then((res) => {
              if (!res.ok) {
                throw new Error(`${res.status} ${emoji}`);
              }
              return res;
            })
            .then((res) => res.text());

          await writeFile(`./dist/svg/${filename}`, svg, "utf8");
        } catch (err) {
          console.error(`${percentage}% Error: ${url2}`);
        }
      }
    }
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
