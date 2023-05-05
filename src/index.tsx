import { Injector, common, webpack, settings } from "replugged";
import { ColorPicker } from "./settingsLoader";

const inject = new Injector();

const COLOR_REGEX =
  /\u{e005b}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e002c}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e005d}/u;
const UNICODE_OFFSET = 0xe0000;
const HEX_BASE = 16;

const parseColorString = (colorString: string): Array<number> => {
  const hexValues = colorString.split(",").map((hex) => parseInt(hex.replace("#", "0x"), HEX_BASE));
  return hexValues;
};

const decodeBio = (bioString: string): Array<number> => {
  if (!bioString) return [];

  const match = bioString.match(COLOR_REGEX);
  if (!match) return [];

  const colorString = match[0];
  const parsedColorString = [...colorString]
    .map((char) => {
      const codePoint = char.codePointAt(0);
      if (codePoint != null && codePoint >= 0 && codePoint <= 0x10FFFF && !isNaN(codePoint)) {
        return String.fromCodePoint(codePoint - UNICODE_OFFSET);
      } else {
        return '';
      }
    })
    .join("");

  const colors = parseColorString(parsedColorString);
  return colors;
};


export function start() {

  const mod = webpack.getByProps(["getMutualGuilds", "getUserProfile"]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inject.after(mod as any, "getUserProfile", (args, res) => {
    if (res) {
      const colours = decodeBio(res.bio);
      res.themeColors = res.themeColors ?? colours;
      res.premiumType = 2;
    }
    return res;
  });
}

export function stop(): void {
  inject.uninjectAll();
}

// export { Settings } from "./settings";
