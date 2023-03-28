import { settings, webpack } from 'replugged'

export async function initSettings(): Promise<void> {
  const Settings = await settings.init('WolfPlug.HiddenProfileColours')

}

export const colorPicker = webpack.getBySource(".customPickerPosition")

