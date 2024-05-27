export interface Scanned {
    humanReadableDiff: string
    suggestedColor: string
    rawInfo: RawInfo
  }

  export type ScannedData = Scanned[]
  
  export interface RawInfo {
    kind: string
    data: Data
  }
  
  export interface Data {
    asset: Asset
    diff: Diff
    counterparty: string
  }
  
  export interface Asset {
    symbol: string
    name: string
    mint: string
    decimals: number
    supply: number
    metaplexTokenStandard: string
    price: Price
    imageUrl: string
    previews: Previews
  }
  
  export interface Price {
    source: string
    updatedAt: number
    dollarValuePerToken: number
  }
  
  export interface Previews {
    small: any
    medium: any
    large: any
  }
  
  export interface Diff {
    sign: string
    digits: number
  }
  