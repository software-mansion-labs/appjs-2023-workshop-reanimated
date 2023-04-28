export const layout = {
  spacing: 8,
  radius: 8,
  knobSize: 24,
  indicatorSize: 48,
}

export const colors = {
  purple: '#683FC2',
  blue: '#007AFF',
  green: '#34C759',
}

type ColorShades = {
  [key in keyof typeof colors]: {
    base: string
    light: string
    dark: string
  }
}

export const colorShades: ColorShades = Object.entries(colors).reduce(
  (acc, [key, value]) => {
    acc[key as keyof typeof colors] = {
      base: value,
      light: `${value}55`,
      dark: `${value}DD`,
    }
    return acc
  },
  {} as ColorShades,
)
