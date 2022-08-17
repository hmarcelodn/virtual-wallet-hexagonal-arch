import { Transaction } from '../../../domain/aggregate';

export interface CreateTransactionPort {
  create(transaction: Transaction): Promise<Transaction>;
}
