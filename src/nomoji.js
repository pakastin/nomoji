import emojiCodes from "./emojicodes.js";

const replaceChars = ["<", ">", "?", "&", "=", ";", ":", '"', "'"].reduce(
  (lookup, char) => {
    lookup[char] = true;
    return lookup;
  },
  {}
);

export default function nomoji(txt = "", prefix = "", noSanitation = false) {
  let results = "";

  const replaceChars = {
    "<": 1,
    ">": 1,
    "?": 1,
    "&": 1,
    "=": 1,
    ";": 1,
    ":": 1,
    '"': 1,
    "'": 1,
  };

  const chars = [];

  for (const char of txt) {
    const codePoint = char.codePointAt(0).toString(16);
    chars.push([char, codePoint]);
  }

  for (let i = 0; i < chars.length; i++) {
    let emoji = emojiCodes;
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
