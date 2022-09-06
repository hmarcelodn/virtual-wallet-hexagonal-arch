import { ExchangeRate } from '../../../domain/aggregate';

export interface BulkSaveExchangeRatePort {
  save(exchangeRates: ExchangeRate[]): Promise<number>;
}
