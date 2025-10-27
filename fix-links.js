import { opendir, readFile, writeFile } from "fs/promises";

const dir = await opendir("dist/svg");

for await (const { name } of dir) {
  if (name.includes(".svg")) {
    const file = await readFile(`dist/svg/${name}`, "utf8");
    if (file[0] !== "<") {
      const filename = file.trim().replace("emoji_u", "");
      const svg = await readFile(`dist/svg/${filename}`, "utf8");
      await writeFile(`dist/svg/${name}`, svg);
      console.log(name, filename);
    }
  }
}
