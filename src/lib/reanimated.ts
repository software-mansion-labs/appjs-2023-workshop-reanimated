export const clamp = (value: number, min: number, max: number) => {
  'worklet'
  return Math.min(Math.max(value, min), max)
}

export const hitSlop = {
  left: 25,
  bottom: 25,
  right: 25,
  top: 25,
}
