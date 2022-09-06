import { inject, injectable } from 'inversify';
import { UserNotFoundError } from '../errors';
import { GENERAL } from '../../shared/constants';
import { ExchangeRateService } from './exchange-rate.service';
import { LoadBalancePort, LoadUserPort } from '../port/out';
import { TYPES } from '../../shared/di/types';

@injectable()
export class InformationBalanceService {
  constructor(
    @inject(TYPES.LoadBalancePort) protected readonly loadBalancePort: LoadBalancePort,
    @inject(TYPES.ExchangeRateService) protected readonly exchangeRateService: ExchangeRateService,
    @inject(TYPES.LoadUserPort) protected readonly loadUserPort: LoadUserPort,
  ) {}

  public getBalance = async (userId: number, currency: string): Promise<number> => {
    const user = await this.loadUserPort.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const userBalance = await this.loadBalancePort.getBalance(user);

    if (currency === GENERAL.DEFAULT_CURRENCY) {
      return Promise.resolve(userBalance);
    }

    return this.exchangeRateService.convert(userBalance, currency);
  };
}
