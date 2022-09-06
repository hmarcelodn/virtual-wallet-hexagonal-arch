import { inject, injectable } from 'inversify';
import { CurrencyLayerError, ExchangeRateNotFoundError } from '../errors';
import { GENERAL } from '../../shared/constants';
import {
  LoadExchangeRatePort,
  SyncExchangeRatePort,
  LoadDailyExchangeRatesPort,
  BulkSaveExchangeRatePort,
} from '../port/out';
import { ExchangeRate } from '../../domain/aggregate';
import { TYPES } from '../../shared/di/types';

@injectable()
export class ExchangeRateService {
  constructor(
    @inject(TYPES.LoadExchangeRatePort)
    protected readonly loadExchangeRatePort: LoadExchangeRatePort,
    @inject(TYPES.SyncExchangeRatePort)
    protected readonly syncExchangeRatePort: SyncExchangeRatePort,
    @inject(TYPES.LoadDailyExchangeRatesPort)
    protected readonly loadDailyExchangeRatesPort: LoadDailyExchangeRatesPort,
    @inject(TYPES.BulkSaveExchangeRatePort)
    protected readonly bulkSaveExchangeRatePort: BulkSaveExchangeRatePort,
  ) {}

  public sync = async () => {
    const todayRates = await this.loadDailyExchangeRatesPort.loadTodayRates();

    if (todayRates > 0) {
      return;
    }
    
    const newExchangeRates = await this.syncExchangeRatePort.sync();

    if (!newExchangeRates) {
      throw new CurrencyLayerError();
    }

    await this.bulkSaveExchangeRatePort.save(newExchangeRates);
  };

  public convert = async (amount: number, currency: string) => {
    await this.sync();

    if (GENERAL.DEFAULT_CURRENCY === currency) {
      return amount;
    }

    const exchangeRate = await this.loadExchangeRatePort.load(GENERAL.DEFAULT_CURRENCY, currency);

    if (!exchangeRate) {
      throw new ExchangeRateNotFoundError(currency);
    }

    return amount * exchangeRate.rate;
  };

  public getExchangeRate = async (currency: string): Promise<ExchangeRate> => {
    await this.sync();
    const exchangeRate = await this.loadExchangeRatePort.load(GENERAL.DEFAULT_CURRENCY, currency);

    if (!exchangeRate) {
      throw new ExchangeRateNotFoundError(currency);
    }

    return exchangeRate;
  };
}
