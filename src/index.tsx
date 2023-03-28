import { Injector, common, webpack, settings } from "replugged";

const inject = new Injector();
const decode = (bio: string): Array<number> | null => {
  if (bio == null) return null;

  const colourString = bio.match(
    /\u{e005b}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e002c}\u{e0023}([\u{e0061}-\u{e0066}\u{e0041}-\u{e0046}\u{e0030}-\u{e0039}]+?)\u{e005d}/u,
  );
  if (colourString != null) {
    const parsed = [...colourString[0]]
      .map((x) => String.fromCodePoint(x.codePointAt(0) - 0xe0000))
      .join('');
    const colours = parsed
      .substring(1, parsed.length - 1)
      .split(',')
      .map((x) => parseInt(x.replace('#', '0x'), 16));

    return colours;
  } else {
    return null;
  }
};

export function start() {
  const mod = webpack.getByProps(["getMutualGuilds","getUserProfile"])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inject.after(mod as any, "getUserProfile", (args, res) => {
    if (res) {
      const colours = decode(res.bio);
      res.themeColors = res.themeColors ?? colours;
      res.premiumType = 2;
    } 
    return res;
  })
}


export function stop(): void {
  inject.uninjectAll();
}

export { Settings } from "./settings";
