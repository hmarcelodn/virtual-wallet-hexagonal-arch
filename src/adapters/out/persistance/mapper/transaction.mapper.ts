import { inject, injectable } from 'inversify';
import { UserMapper } from '.';
import { PaymentType, Transaction } from '../../../../domain/aggregate';
import { TYPES } from '../../../../shared/di/types';
import { PaymentTypeDao, TransactionDao } from '../dao';

@injectable()
export class TransactionMapper {
  constructor(@inject(TYPES.UserMapper) private readonly userMapper: UserMapper) {}

  public toDomain = (transactionDao: TransactionDao): Transaction => {
    const transaction = new Transaction();
    transaction.id = transactionDao.id;
    transaction.type = transactionDao.type as unknown as PaymentType;
    transaction.user = this.userMapper.toDomain(transactionDao.user);
    transaction.value = transactionDao.value;

    return transaction;
  };

  public toEntity = (transaction: Transaction): TransactionDao => {
    const transactionDao = new TransactionDao();
    transactionDao.id = transaction.id;
    transactionDao.type = transaction.type as unknown as PaymentTypeDao;
    transactionDao.user = this.userMapper.toEntity(transaction.user);
    transactionDao.value = transaction.value;
    return transactionDao;
  };
}
