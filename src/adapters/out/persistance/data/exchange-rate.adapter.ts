import { Service } from 'typedi';
import { MoreThan } from 'typeorm';
import { ExchangeRateDao } from '../dao';
import { AppDataSource } from '../../../../shared/data/config';
import { LoadDailyExchangeRatesPort, LoadExchangeRatePort } from '../../../../application/port/out';
import { ExchangeRateMapper } from '../mapper';
import { ExchangeRate } from '../../../../domain/aggregate';

@Service()
export class ExchangeRateAdapter implements LoadDailyExchangeRatesPort, LoadExchangeRatePort {
  constructor(
    protected readonly exchangeRateRepository = AppDataSource.getRepository(ExchangeRateDao),
    protected readonly exchangeRateMapper: ExchangeRateMapper,
  ) {}

  public loadTodayRates = (): Promise<number> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.exchangeRateRepository.count({
      where: {
        date: MoreThan(today),
      },
    });
  };

  public load = async (from: string, to: string): Promise<ExchangeRate | null> => {
    const exchangeRateDao = await this.exchangeRateRepository.findOne({
      where: {
        quote: `${from}${to}`,
      },
      order: { id: 'DESC' },
    });

    return this.exchangeRateMapper.toDomain(exchangeRateDao);
  };
}
