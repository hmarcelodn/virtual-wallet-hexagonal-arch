import { PaymentType, Transaction, User } from '../../../domain/aggregate';

export interface LoadPaymentTransactionsPort {
  getPaymentTransactions(user: User, type: PaymentType): Promise<Transaction[]>;
}
