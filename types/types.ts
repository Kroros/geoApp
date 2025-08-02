export type Coords = {
  lat: number,
  lng: number
}

export type Volcano = {
    fType: string,
    id: number,
    name: string,
    type: string,
    region: string,
    lastEruption: number,
    elevation: number,
    setting: string,
    rockType: string,
    location: Coords,
    country: string
}

export type Crater = {
    fType: string,
    id: number,
    name: string,
    diameter: number,
    age: number,
    location: Coords,
    ageCertainty: string
}

export type Deposit = {
    fType: string,
    id: number,
    name: string,
    country: string,
    type: string,
    location: Coords,
    commodity: string
}

export type Filter = {
    features: string[],
    countries: string[],
    commodities: string[],
    elevation: number[],
    diameter: number[],
    distance: number[]
}