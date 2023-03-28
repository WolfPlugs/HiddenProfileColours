import { webpack, common, components, settings } from "replugged";

import { colorPicker } from "./settingsLoader";

const { Modal: { ModalRoot }, FormItem, ErrorBoundary } = components;
const { users, React } = common;


function normalizeToHex(colorString: number): string {
  if (chroma.valid(colorString)) return chroma(colorString).hex();

  const color = Number(RN.processColor(colorString));

  return chroma
    .rgb(
      (color >> 16) & 0xff, // red
      (color >> 8) & 0xff, // green
      color & 0xff, // blue
      (color >> 24) & 0xff, // alpha
    )
    .hex();
}


export function Settings(): React.ReactElement {

  // const currentColours = users.getCurrentUser().themeColors;
  const [colors, setColours] = React.useState<Array<number>>([]);

  return (
    <div>
      <FormItem
        title="Custom Colours"
        required={false}
        className="customPickerPosition"
      >
        <colorPicker />
      </FormItem>

    </div>
  )
}
