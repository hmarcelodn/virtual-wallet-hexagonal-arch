import { Service } from 'typedi';
import { TransactionService } from '../../domain/service';
import { UserNotFoundError } from '../errors';
import { GENERAL } from '../../shared/constants';
import { ExchangeRateService } from './exchange-rate.service';
import { LoadUserPort } from '../port/out';

@Service()
export class InformationBalanceService {
  constructor(
    protected readonly transactionService: TransactionService,
    protected readonly exchangeRateService: ExchangeRateService,
    protected readonly loadUserPort: LoadUserPort,
  ) {}

  public getBalance = async (userId: number, currency: string): Promise<number> => {
    const user = await this.loadUserPort.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const userBalance = await this.transactionService.getBalance(user);

    if (currency === GENERAL.DEFAULT_CURRENCY) {
      return Promise.resolve(userBalance);
    }

    return this.exchangeRateService.convert(userBalance, currency);
  };
}
