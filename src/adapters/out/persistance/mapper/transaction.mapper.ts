import { Service } from 'typedi';
import { Transaction } from '../../../../domain/aggregate';
import { TransactionDao } from '../dao';

@Service()
export class TransactionMapper {
  public toDomain = (transactionDao: TransactionDao): Transaction => {
    const transaction = new Transaction();
    return transaction;
  };

  public toEntity = (transaction: Transaction): TransactionDao => {
    const transactionDao = new TransactionDao();
    return transactionDao;
  };
}
