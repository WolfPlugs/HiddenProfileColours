import { Injector, webpack } from "replugged";

const inject = new Injector();

const COLOR_REGEX: RegExp = /\[(\#[0-9a-fA-F]{6})\s*,\s*(\#[0-9a-fA-F]{6})\]/;

const decodeBio = (bioString: string): Array<number> => {
  if (!bioString) return [];

  const isDecodable: boolean = Boolean(
    [...bioString].some((x) => x.codePointAt(0) > 0xe0000 && x.codePointAt(0) < 0xe007f)
  );
  if (!isDecodable) return [];

  const decodedBio: string = [...bioString]
    .map((x) =>
      x.codePointAt(0) > 0xe0000 && x.codePointAt(0) < 0xe007f
        ? String.fromCodePoint(x.codePointAt(0) - 0xe0000)
        : x
    )
    .join("");

  const bio: Array<number> = decodedBio
    .match(COLOR_REGEX)
    .filter((s) => !/\[|\]/.test(s))
    .map((c) => parseInt(`0x${c.slice(1)}`));
  return bio;
};


export async function start() {

  const mod = webpack.getByProps(["getMutualGuilds", "getUserProfile"]);

  inject.after(mod as any, "getUserProfile", (args, res) => {
    if (res) {
      const themeColors = decodeBio(res?.bio);
      if (!res || !themeColors.length) return res;
      res.themeColors = res.themeColors ?? themeColors;
      res.premiumType = 2;
      return res;
    }
    return res;
  });

  inject.after(const mode = webpack.getBySource('"poggermode_enabled"', { raw: true }).exports, "Z", (args, res) => {
    inject.after(res.find(m => m.section == "Profile Customization"), "element", (args, res) => {
      inject.after(res.props.children.props.children.find(m => m?.props?.navigateToGuildIdentitySettings), "type", (args, res) => {
        inject.after(res.props.children.props.children[0].props.children, "type", (args, res) => {
          inject.after(res?.props?.children?.find?.(m => Array.isArray(m?.props?.children) && m?.props?.children?.some?.(im => im?.props?.children?.toString?.()?.includes("pendingColors")))?.props?.children?.find?.(pc => pc?.props?.children?.toString?.()?.includes("pendingColors")).props, "children", (args, res) => {
            inject.after(res, "type", (args, res) => {
              console.log(args, res);
              //pushing to res.props.children.props.children should work here
              return res;
            });
            return res;
          });
          return res;
        });
        return res;
      });
      return res;
    });
    return res;
  });
}

export function stop(): void {
  inject.uninjectAll();
}

// export { Settings } from "./settings";
