import { Service } from 'typedi';
import {
  LoadPaymentTransactionsPort,
  LoadTransactionsByPeriodPort,
} from '../../application/port/out';
import { PaymentType, Transaction, User } from '../aggregate';

@Service()
export class TransactionService {
  constructor(
    protected readonly loadPaymentTransactionsPort: LoadPaymentTransactionsPort,
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
  ) => {
    const paymentTrx = await this.getTransactionsByPeriod(user, startDate, endDate, type);
    return paymentTrx.reduce(this.transactionReducer, 0);
  };

  public getTransactionsByPeriod = (
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ) => {
    return this.loadTransactionsByPeriodPort.getTransactionsByPeriod(
      user,
      startDate,
      endDate,
      type,
    );
  };
}
