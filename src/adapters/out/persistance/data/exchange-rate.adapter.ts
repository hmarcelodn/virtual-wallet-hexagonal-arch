import { inject, injectable } from 'inversify';
import { InsertResult, MoreThan } from 'typeorm';
import { ExchangeRateDao } from '../dao';
import { AppDataSource } from '../../../../shared/data/config';
import {
  BulkSaveExchangeRatePort,
  LoadDailyExchangeRatesPort,
  LoadExchangeRatePort,
} from '../../../../application/port/out';
import { ExchangeRateMapper } from '../mapper';
import { ExchangeRate } from '../../../../domain/aggregate';
import { TYPES } from '../../../../shared/di/types';

@injectable()
export class ExchangeRateAdapter
  implements LoadDailyExchangeRatesPort, LoadExchangeRatePort, BulkSaveExchangeRatePort
{
  protected readonly exchangeRateRepository = AppDataSource.getRepository(ExchangeRateDao);

  constructor(
    @inject(TYPES.ExchangeRateMapper) protected readonly exchangeRateMapper: ExchangeRateMapper,
  ) {}

  public save = async (exchangeRates: ExchangeRate[]): Promise<number> => {
    const exchangeRateDaos = exchangeRates.map((er) => this.exchangeRateMapper.toEntity(er));

    const result = await AppDataSource.createQueryBuilder()
      .insert()
      .into(ExchangeRateDao)
      .values(exchangeRateDaos)
      .execute();

    return result.identifiers.length;
  };

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

    if (!exchangeRateDao) {
      return null;
    }

    return this.exchangeRateMapper.toDomain(exchangeRateDao);
  };
}
