import { inject, injectable } from 'inversify';
import * as _ from 'lodash';
import { UserNotFoundError } from '../errors';
import { ExchangeRateService } from './exchange-rate.service';
import { SeriesInputDto, SeriesResultResponseDto } from '../dto';
import { PaymentType, Transaction } from '../../domain/aggregate';
import { LoadBalancePort, LoadUserPort } from '../port/out';
import { TYPES } from '../../shared/di/types';
import { GENERAL } from '../../shared/constants';

@injectable()
export class InformationSeriesService {
  constructor(
    @inject(TYPES.ExchangeRateService) protected readonly exchangeRateService: ExchangeRateService,
    @inject(TYPES.LoadBalancePort) protected readonly loadBalancePort: LoadBalancePort,
    @inject(TYPES.LoadUserPort) protected readonly loadUserPort: LoadUserPort,
  ) {}

  public series = async (
    userId: number,
    seriesInput: SeriesInputDto,
  ): Promise<SeriesResultResponseDto> => {
    const user = await this.loadUserPort.findById(userId);
    let currencyRate = 1;

    if (GENERAL.DEFAULT_CURRENCY !== seriesInput.currency) {
      const exchangeRate = await this.exchangeRateService.getExchangeRate(seriesInput.currency); 
      currencyRate = exchangeRate.rate;
    }

    if (!user) {
      throw new UserNotFoundError();
    }

    const filledTrx = this.loadBalancePort.getTransactionsByPeriod(
      user,
      seriesInput.startDate,
      seriesInput.endDate,
      PaymentType.PAYMENT_FILL,
    );

    const madeTrx = this.loadBalancePort.getTransactionsByPeriod(
      user,
      seriesInput.startDate,
      seriesInput.endDate,
      PaymentType.PAYMENT_MADE,
    );

    const receivedTrx = this.loadBalancePort.getTransactionsByPeriod(
      user,
      seriesInput.startDate,
      seriesInput.endDate,
      PaymentType.PAYMENT_RECEIVED,
    );

    const withdrawTrx = this.loadBalancePort.getTransactionsByPeriod(
      user,
      seriesInput.startDate,
      seriesInput.endDate,
      PaymentType.PAYMENT_WITHDRAW,
    );

    const allTrxByType = await Promise.all([filledTrx, madeTrx, receivedTrx, withdrawTrx]);

    const allTrx = allTrxByType.reduce((arr, trx) => {
      return arr.concat(trx);
    }, []);

    const trxByDateMap = new Map<string, Transaction[]>();
    allTrx.forEach((trx: Transaction) => {
      const date = trx.date.toISOString().split('T')[0];

      if (!trxByDateMap.get(date)) {
        trxByDateMap.set(date, []);
      }

      trxByDateMap.get(date)?.push(trx);
    });

    const seriesResultResponse: SeriesResultResponseDto = {
      payments_received: [],
      payments_made: [],
      withdrawn: [],
      filled: [],
      dates: [],
    };

    for (const trxDate of Array.from(trxByDateMap.keys())) {
      const trxByPaymentTypeMap = new Map<string, number>();
      const trxByDate = trxByDateMap.get(trxDate);

      trxByDate?.forEach((trx: Transaction) => {
        const amount = (trxByPaymentTypeMap.get(trx.type) || 0) + trx.value;
        trxByPaymentTypeMap.set(trx.type, amount);
      });

      seriesResultResponse.payments_received.push(
        (trxByPaymentTypeMap.get(PaymentType.PAYMENT_RECEIVED) || 0) * currencyRate,
      );

      seriesResultResponse.payments_made.push(
        (trxByPaymentTypeMap.get(PaymentType.PAYMENT_MADE) || 0) * currencyRate,
      );

      seriesResultResponse.withdrawn.push(
        (trxByPaymentTypeMap.get(PaymentType.PAYMENT_WITHDRAW) || 0) * currencyRate,
      );

      seriesResultResponse.filled.push(
        (trxByPaymentTypeMap.get(PaymentType.PAYMENT_FILL) || 0) * currencyRate,
      );

      seriesResultResponse.dates.push(trxDate);
    }

    return seriesResultResponse;
  };
}
