import { ExchangeRate } from '../../../domain/aggregate';

export interface SyncExchangeRatePort {
  sync(): Promise<ExchangeRate[] | undefined>;
}
