export interface LoadDailyExchangeRatesPort {
  loadTodayRates(): Promise<number>;
}
