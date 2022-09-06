import { PaymentType, Transaction, User } from '../../../domain/aggregate';

export interface LoadBalancePort {
  getBalance(user: User): Promise<number>;
  getTransactionsAmountByPeriod(
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ): Promise<number>;
  getTransactionsByPeriod(
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ): Promise<Transaction[]>;
}
