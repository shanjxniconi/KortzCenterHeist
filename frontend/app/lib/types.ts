export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
} 

export interface ItemRequest {
  multiPlayer: boolean;
  playerCount: number;
  items: Item[];
  requiredItems: Item[];
}

export interface ItemCalcResponse {
  selectedItemCount: number;
  remainingVolume: number;
  totalValue: number;
  totalValueAllPlayers?: number;
  selectedItems?: Item[];
}

export type ToolResponse<T> = {
  status: string
  text: string | null
  obj: T | ApiError | null
}

export type ApiError = {
  code?: string,
}

export type Item = {
  name: string;
  volume?: number;
  type?: string;
  location: string;
  value: number;
  isAvailable: boolean;
}

export type AnalysisResponse = {
  result: string;
}