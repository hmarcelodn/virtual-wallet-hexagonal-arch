import { inject, injectable } from 'inversify';
import {
  LoadBalancePort,
  LoadPaymentTransactionsPort,
  LoadTransactionsByPeriodPort,
} from '../../application/port/out';
import { TYPES } from '../../shared/di/types';
import { PaymentType, Transaction, User } from '../aggregate';

@injectable()
export class TransactionService implements LoadBalancePort {
  constructor(
    @inject(TYPES.LoadPaymentTransactionsPort)
    protected readonly loadPaymentTransactionsPort: LoadPaymentTransactionsPort,
    @inject(TYPES.LoadTransactionsByPeriodPort)
    protected readonly loadTransactionsByPeriodPort: LoadTransactionsByPeriodPort,
  ) {}

  protected transactionReducer = (acc: number, current: Transaction) => {
    return acc + Number(current.value);
  };

  public getBalance = async (user: User): Promise<number> => {
    const paymentFillTrx = await this.loadPaymentTransactionsPort.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_FILL,
    );
    const paymentMadeTrx = await this.loadPaymentTransactionsPort.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_MADE,
    );
    const paymentReceivedTrx = await this.loadPaymentTransactionsPort.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_RECEIVED,
    );
    const paymentWithdrawTrx = await this.loadPaymentTransactionsPort.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_WITHDRAW,
    );

    const fillTotal = paymentFillTrx.reduce(this.transactionReducer, 0);
    const madeTotal = paymentMadeTrx.reduce(this.transactionReducer, 0);
    const receivedTotal = paymentReceivedTrx.reduce(this.transactionReducer, 0);
    const withdrawTotal = paymentWithdrawTrx.reduce(this.transactionReducer, 0);

    return fillTotal - withdrawTotal - madeTotal + receivedTotal;
  };

  public getTransactionsAmountByPeriod = async (
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ): Promise<number> => {
    const paymentTrx = await this.getTransactionsByPeriod(user, startDate, endDate, type);
    return paymentTrx.reduce(this.transactionReducer, 0);
  };

  public getTransactionsByPeriod = (
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ): Promise<Transaction[]> => {
    return this.loadTransactionsByPeriodPort.getTransactionsByPeriod(
      user,
      startDate,
      endDate,
      type,
    );
  };
}
