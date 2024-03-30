export function toCSSColor(color: string): string {
  return color.startsWith("#") ? color : `#${color}`
}
