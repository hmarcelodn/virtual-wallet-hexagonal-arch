export interface LoadExchangeRatePort {
  load(from: string, to: string): Promise<any>;
}
