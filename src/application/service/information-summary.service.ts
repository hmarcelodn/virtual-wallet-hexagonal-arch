import { inject, injectable } from 'inversify';
import { PaymentType } from '../../domain/aggregate';
import { TYPES } from '../../shared/di/types';
import { SummaryInputDto } from '../dto';
import { UserNotFoundError } from '../errors';
import { LoadBalancePort, LoadUserPort } from '../port/out';
import { ExchangeRateService } from './exchange-rate.service';

@injectable()
export class InformationSummaryService {
  constructor(
    @inject(TYPES.LoadBalancePort) protected readonly loadBalancePort: LoadBalancePort,
    @inject(TYPES.ExchangeRateService) protected readonly exchangeRateService: ExchangeRateService,
    @inject(TYPES.LoadUserPort) protected readonly loadUserPort: LoadUserPort,
  ) {}

  public summary = async (userId: number, summaryInput: SummaryInputDto) => {
    const user = await this.loadUserPort.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    let filledAmount = await this.loadBalancePort.getTransactionsAmountByPeriod(
      user,
      summaryInput?.startDate,
      summaryInput.endDate,
      PaymentType.PAYMENT_FILL,
    );
    let madeAmount = await this.loadBalancePort.getTransactionsAmountByPeriod(
      user,
      summaryInput?.startDate,
      summaryInput.endDate,
      PaymentType.PAYMENT_MADE,
    );
    let receivedAmount = await this.loadBalancePort.getTransactionsAmountByPeriod(
      user,
      summaryInput?.startDate,
      summaryInput.endDate,
      PaymentType.PAYMENT_RECEIVED,
    );
    let withdrawAmount = await this.loadBalancePort.getTransactionsAmountByPeriod(
      user,
      summaryInput?.startDate,
      summaryInput.endDate,
      PaymentType.PAYMENT_WITHDRAW,
    );

    filledAmount = await this.exchangeRateService.convert(filledAmount, summaryInput?.currency);
    madeAmount = await this.exchangeRateService.convert(madeAmount, summaryInput.currency);
    receivedAmount = await this.exchangeRateService.convert(receivedAmount, summaryInput.currency);
    withdrawAmount = await this.exchangeRateService.convert(withdrawAmount, summaryInput.currency);

    return {
      payments_received: receivedAmount,
      payments_made: madeAmount,
      withdrawn: withdrawAmount,
      filled: filledAmount,
    };
  };
}
