import axios from 'axios';
import { Service } from 'typedi';
import { ExchangeRateResponseDto } from '../dto';
import { ExchangeRateNotFoundError } from '../errors';
import { GENERAL } from '../../shared/constants';
import { AppDataSource } from '../../shared/data/config';
import {
  LoadExchangeRatePort,
  SyncExchangeRatePort,
  LoadDailyExchangeRatesPort,
} from '../port/out';
import { ExchangeRate } from '../../domain/aggregate';

@Service()
export class ExchangeRateService {
  constructor(
    protected readonly loadExchangeRatePort: LoadExchangeRatePort,
    protected readonly syncExchangeRatePort: SyncExchangeRatePort,
    protected readonly loadDailyExchangeRatesPort: LoadDailyExchangeRatesPort,
  ) {}

  public sync = async () => {
    const todayRates = await this.loadDailyExchangeRatesPort.loadTodayRates();

    if (todayRates > 0) {
      return;
    }

    const exchangeRatesResponse = await axios.get<ExchangeRateResponseDto>(
      'http://api.currencylayer.com/live?access_key=c651b82abba16d81e83cc550e0b3eb33&format=1',
    );

    if (exchangeRatesResponse.status !== 200) {
      throw new Error();
    }

    const exchangeRateEntries = Object.entries(exchangeRatesResponse.data.quotes);
    const newExchangeRates = new Array<ExchangeRate>();

    for (const [key, value] of exchangeRateEntries) {
      const newExchangeRate = new ExchangeRate();
      newExchangeRate.quote = key;
      newExchangeRate.rate = value;
      newExchangeRates.push(newExchangeRate);
    }

    await AppDataSource.createQueryBuilder()
      .insert()
      .into(ExchangeRate)
      .values(newExchangeRates)
      .execute();
  };

  public convert = async (amount: number, currency: string) => {
    await this.sync();
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
