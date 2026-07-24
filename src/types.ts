export type BattleCategory = 'Historical' | 'Fantasy' | 'Science Fiction'

export type Side = 'allied' | 'french'

export interface Position {
  x: number
  y: number
}

export interface Unit {
  id: string
  name: string
  side: Side
  strength: string
  path: Array<Position & { at: number }>
}

export interface BattleEvent {
  id: string
  at: number
  time: string
  title: string
  description: string
  position: Position
}

export interface Commander {
  name: string
  role: string
  side: Side
  monogram: string
}

export interface Battle {
  id: string
  title: string
  location: string
  date: string
  duration: string
  summary: string
  outcome: string
  forces: string
  casualties: string
  commanders: Commander[]
  units: Unit[]
  events: BattleEvent[]
}

export interface CatalogBattle {
  title: string
  year: string
  category: BattleCategory
  location: string
  available: boolean
}
