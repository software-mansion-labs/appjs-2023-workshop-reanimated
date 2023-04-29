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

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
export async function sleep(ms = 1000, value = true) {
  await timeout(ms)
  return value
}
