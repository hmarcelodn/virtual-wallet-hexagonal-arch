import { Service } from 'typedi';
import { UserMapper } from '.';
import { PaymentType, Transaction } from '../../../../domain/aggregate';
import { PaymentTypeDao, TransactionDao } from '../dao';

@Service()
export class TransactionMapper {
  constructor(private readonly userMapper: UserMapper) {}

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
