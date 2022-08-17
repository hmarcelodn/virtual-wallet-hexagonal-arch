import { Service } from 'typedi';
import { ExchangeRate } from '../../../../domain/aggregate';
import { ExchangeRateDao } from '../dao';

@Service()
export class ExchangeRateMapper {
  public toDomain = (exchangeRateDao: ExchangeRateDao | null): ExchangeRate => {
    const exchangeRate = new ExchangeRate();
    return exchangeRate;
  };

  public toEntity = (exchangeRate: ExchangeRate | null): ExchangeRateDao => {
    const exchangeRateDao = new ExchangeRateDao();
    return exchangeRateDao;
  };
}
