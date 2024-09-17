import dayjs, { Dayjs } from "dayjs"

export interface SimpleLine {
  id: string
  number: string
  backgroundColor: string
  textColor: string
  pictoSvg?: string
  numberShapeSvg?: string
  importance: number
}

export interface SimpleStop {
  id: string
  name: string
  position: Position
  lines: SimpleLine[]
}

export interface Position {
  lat: number
  long: number
}

export interface SimpleDeparture {
  destination: string
  leavesAt: Dayjs
  id: string
  branchHash?: string
}

export interface SimpleDisruption {
  description: string
  line: SimpleLine
  type: "worksite" | "info" | "incident" | "stoppedService"
}

const hostname = window.location.hostname

function processSVG(svg: string): string {
  return svg
    .replace(/width="[^"]+"/, "")
    .replace(/height="[^"]+"/, `height="100%"`)
}

export class Wagon {
  private static BASE_URL = "https://api-wagon.arno.cl/gantry/"

  private static get baseUrl(): string {
    return Wagon.BASE_URL
  }

  private static get apiKey(): string {
    if (hostname === "localhost") {
      return "vite"
    }

    return "pist"
  }

  private static positionFromDTO(positionDto: any): Position {
    return {
      lat: positionDto[0],
      long: positionDto[1],
    }
  }

  private static stopFromDTO(stopDto: any, lines: SimpleLine[]): SimpleStop {
    const linesIds = Array.from(
      new Set(
        stopDto.stops
          .map((stop: any) => stop.lines.map((line: any) => line))
          .flat()
      )
    )
    return {
      id: stopDto.id,
      name: stopDto.name,
      position: this.positionFromDTO(stopDto.averagePosition),
      lines: lines.filter((line) => linesIds.includes(line.id)),
    }
  }

  private static lineFromDTO(lineDto: any): SimpleLine {
    return {
      id: lineDto.id,
      number: lineDto.number,
      backgroundColor: lineDto.backgroundColor,
      textColor: lineDto.textColor,
      pictoSvg: processSVG(lineDto.modeSvg ?? ""),
      numberShapeSvg: processSVG(lineDto.numberShapeSvg ?? ""),
      importance: lineDto.importance,
    }
  }

  public static async searchStops(search: string): Promise<SimpleStop[]> {
    const params = new URLSearchParams()
    params.append("action", "searchStops")
    params.append("coordinates", "48.86,2.34")
    params.append("compatibilityDate", "2024-03-30")
    params.append("apiKey", this.apiKey)
    params.append("q", search)

    const response = await fetch(`${this.baseUrl}?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to search stations")
    }

    const json = await response.json()

    const lines: SimpleLine[] = json.data.lines.map((line: any) => {
      return this.lineFromDTO(line)
    })

    const stops: SimpleStop[] = json.data.stops.map((stop: any) => {
      return this.stopFromDTO(stop, lines)
    })

    return stops
  }

  public static async getDeparturesNear(
    lat: number,
    lon: number,
    lineNumber: string
  ): Promise<{
    departures: SimpleDeparture[]
    line: SimpleLine
  }> {
    let params = new URLSearchParams()

    params.append("action", "departuresNearby")
    params.append("coordinates", `${lat},${lon}`)
    params.append("compatibilityDate", "2024-03-30")
    params.append("apiKey", this.apiKey)

    const response = await fetch(`${this.baseUrl}?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to fetch departures")
    }

    const json = await response.json()

    const lineDto = json.data.lines.find(
      (x: any) => x.number.toUpperCase() === lineNumber.toUpperCase()
    )

    const line = this.lineFromDTO(lineDto)

    const departures: SimpleDeparture[] = []
    let stopId: string | null = null

    for (const line of json.data.departures) {
      if (line.lineRef !== lineDto.id) continue

      for (const branch of line.destinations) {
        for (const destination of branch) {
          if (stopId === null) {
            stopId = destination.source
          }

          if (stopId !== destination.source) {
            continue
          }

          for (const departure of destination.nextDepartures) {
            if (departure.departure.canceled) continue

            departures.push({
              destination: departure.destinationLabel,
              leavesAt: dayjs(
                departure.departure.realTime || departure.departure.theoretical
              ),
              id: departure.journeyId,
              branchHash: departure.branchHash,
            })
          }
        }
      }
    }

    return {
      departures,
      line,
    }
  }

  private static getDisruptionType(
    cause: string,
    effect: string
  ): SimpleDisruption["type"] {
    if (effect === "stoppedService") {
      return "stoppedService"
    }

    if (cause === "worksite") {
      return "worksite"
    }

    if (
      ["delays", "movedStops", "nonDesservedStops", "reducedService"].includes(
        effect
      )
    ) {
      return "incident"
    }

    return "info"
  }

  public static async getDisruptions(
    lat: number,
    lon: number,
    line: string,
    currentStop: string,
    terminus: string
  ): Promise<SimpleDisruption[]> {
    let params = new URLSearchParams()

    params.append("action", "disruptionsAlongLine")
    params.append("coordinates", `${lat},${lon}`)
    params.append("compatibilityDate", "2024-06-22")
    params.append("line", line)
    params.append("stops", JSON.stringify([currentStop, terminus]))
    params.append("apiKey", this.apiKey)

    const response = await fetch(`${this.baseUrl}?${params.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to fetch disruptions")
    }

    const json = await response.json()

    const lines: SimpleLine[] = json.data.lines.map((line: any) =>
      this.lineFromDTO(line)
    )

    const disruptions: SimpleDisruption[] = []

    for (const disruption of json.data.disruptions) {
      const line = lines.find((x) => x.id === disruption.routeId)

      if (!line) {
        console.error("Line not found for disruption", disruption)
        continue
      }

      disruptions.push({
        description: disruption.details,
        line,
        type: this.getDisruptionType(disruption.cause, disruption.effect),
      })
    }

    return disruptions
  }
}
