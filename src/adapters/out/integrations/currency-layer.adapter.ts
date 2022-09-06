import { injectable } from 'inversify';
import axios from 'axios';
import { SyncExchangeRatePort } from '../../../application/port/out';
import { ExchangeRateResponseDto } from '../../../application/dto';
import { ExchangeRate } from '../../../domain/aggregate';

@injectable()
export class CurrencyLayerAdapter implements SyncExchangeRatePort {
  public sync = async (): Promise<ExchangeRate[] | undefined> => {
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

    return newExchangeRates;
  };
}
