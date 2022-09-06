import { injectable } from 'inversify';
import { ExchangeRate } from '../../../../domain/aggregate';
import { ExchangeRateDao } from '../dao';

@injectable()
export class ExchangeRateMapper {
  public toDomain = (exchangeRateDao: ExchangeRateDao): ExchangeRate => {
    const exchangeRate = new ExchangeRate();
    exchangeRate.id = exchangeRateDao?.id;
    exchangeRate.date = exchangeRateDao?.date;
    exchangeRate.quote = exchangeRateDao?.quote;
    exchangeRate.rate = exchangeRateDao?.rate;
    return exchangeRate;
  };

  public toEntity = (exchangeRate: ExchangeRate): ExchangeRateDao => {
    const exchangeRateDao = new ExchangeRateDao();
    exchangeRateDao.id = exchangeRate.id;
    exchangeRateDao.date = exchangeRate.date;
    exchangeRateDao.quote = exchangeRate.quote;
    exchangeRateDao.rate = exchangeRate.rate;
    return exchangeRateDao;
  };
}
