import { SimpleLine } from "../services/Wagon"

export function sortLines(lines: SimpleLine[]): SimpleLine[] {
  return lines.sort((a, b) => {
    if (!isNaN(Number(a.number)) && !isNaN(Number(b.number))) {
      return Number(a.number) - Number(b.number)
    } else if (!isNaN(Number(a.number))) {
      return -1
    } else if (!isNaN(Number(b.number))) {
      return 1
    } else {
      return a.number.localeCompare(b.number)
    }
  })
}
