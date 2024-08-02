import { readFile, writeFile } from "fs/promises";

const emojis = await fetch(
  "https://www.unicode.org/Public/emoji/latest/emoji-test.txt"
).then((res) => res.text());

await writeFile("emojis.txt", emojis, "utf8");

console.log("done");
