import { PaymentType, Transaction, User } from '../../../domain/aggregate';

export interface LoadTransactionsByPeriodPort {
  getTransactionsByPeriod(
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ): Promise<Transaction[]>;
}
