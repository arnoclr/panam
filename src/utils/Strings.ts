export function toCamelCase(str: string, separator: string): string {
  return str.replace(new RegExp(separator + "(.)", "g"), (_, group) =>
    group.toUpperCase()
  )
}
