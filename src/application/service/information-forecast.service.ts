import { inject, injectable } from 'inversify';
import { PaymentType } from '../../domain/aggregate';
import { TYPES } from '../../shared/di/types';
import { ForecastInputDto, ForecastResponseDto } from '../dto';
import { UserNotFoundError } from '../errors';
import { LoadUserPort } from '../port/out';
import { LoadTransactionsByLastDaysPort } from '../port/out/load-transactions-by-last-days.port';
import { ExchangeRateService } from './exchange-rate.service';

@injectable()
export class InformationForecastService {
  constructor(
    @inject(TYPES.ExchangeRateService) protected readonly exchangeRateService: ExchangeRateService,
    @inject(TYPES.LoadUserPort) protected readonly loadUserPort: LoadUserPort,
    @inject(TYPES.LoadTransactionsByLastDaysPort)
    protected readonly loadTransactionsByLastDaysPort: LoadTransactionsByLastDaysPort,
  ) {}

  public forecast = async (userId: number, forecastInput: ForecastInputDto) => {
    const user = await this.loadUserPort.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const exchangeRate = await this.exchangeRateService.getExchangeRate(forecastInput.currency);
    const lastNDaysTrx = await this.loadTransactionsByLastDaysPort.getTransactionsByLastNDays(
      user,
      forecastInput.days,
      forecastInput.type,
    );
    const forecastResponse: ForecastResponseDto = {
      dates: [],
    };

    for (const aggregatedTrx of lastNDaysTrx) {
      forecastResponse.dates?.push(aggregatedTrx.date.toString());
      const totalAmount = exchangeRate.rate * aggregatedTrx.amount;

      if (forecastInput.type === PaymentType.PAYMENT_FILL.toString()) {
        forecastResponse.payment_fill = [totalAmount];
      }

      if (forecastInput.type === PaymentType.PAYMENT_MADE.toString()) {
        forecastResponse.payment_made = [totalAmount];
      }

      if (forecastInput.type === PaymentType.PAYMENT_RECEIVED.toString()) {
        forecastResponse.payment_received = [totalAmount];
      }

      if (forecastInput.type === PaymentType.PAYMENT_WITHDRAW.toString()) {
        forecastResponse.payment_withdraw = [totalAmount];
      }
    }

    return forecastResponse;
  };
}
