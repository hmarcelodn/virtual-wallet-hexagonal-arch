import { Service } from 'typedi';
import { LessThan, MoreThan } from 'typeorm';
import { ForecastProjectionResultDto } from '../dto';
import { AppDataSource } from '../../../../shared/data/config';
import { PaymentType, Transaction, User } from '../../../../domain/aggregate';
import { TransactionMapper } from '../mapper';
import {
  CreateTransactionPort,
  LoadPaymentTransactionsPort,
  LoadTransactionsByPeriodPort,
} from '../../../../application/port/out';
import { LoadTransactionsByLastDaysPort } from '../../../../application/port/out/load-transactions-by-last-days.port';
import { PaymentTypeDao, TransactionDao } from '../dao';

@Service()
export class TransactionAdapter
  implements
    LoadTransactionsByPeriodPort,
    CreateTransactionPort,
    LoadPaymentTransactionsPort,
    LoadTransactionsByLastDaysPort
{
  constructor(
    protected readonly transactionRepository = AppDataSource.getRepository(TransactionDao),
    protected readonly transactionMapper: TransactionMapper,
  ) {}

  public create = async (transaction: Transaction): Promise<Transaction> => {
    const transactionDao = this.transactionMapper.toEntity(transaction);
    return this.transactionMapper.toDomain(await this.transactionRepository.save(transactionDao));
  };

  public getTransactionsByUserId = async (user: User): Promise<Array<Transaction>> => {
    const transactionsDao = await this.transactionRepository.find({ where: { user } });
    return transactionsDao.map((tx) => this.transactionMapper.toDomain(tx));
  };

  public getPaymentTransactions = async (
    user: User,
    type: PaymentType,
  ): Promise<Array<Transaction>> => {
    const paymentTypeDao = type as unknown as PaymentTypeDao;
    const transactionsDao = await this.transactionRepository.find({
      where: { user, type: paymentTypeDao },
    });
    return transactionsDao.map((tx) => this.transactionMapper.toDomain(tx));
  };

  public getTransactionsByPeriod = async (
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ): Promise<Array<Transaction>> => {
    const transactionsDao = await this.transactionRepository.find({
      where: {
        user: user,
        date: MoreThan(startDate) && LessThan(endDate),
        type: type as unknown as PaymentTypeDao,
      },
    });

    return transactionsDao.map((tx) => this.transactionMapper.toDomain(tx));
  };

  public getTransactionsByLastNDays = (
    user: User,
    days: number,
    type: string,
  ): Promise<ForecastProjectionResultDto[]> => {
    const nDaysBefore = new Date();
    nDaysBefore.setHours(0, 0, 0, 0);
    nDaysBefore.setDate(nDaysBefore.getDate() - days);

    return this.transactionRepository.query(
      `
            select substring(cast(date as varchar) from 1 for 10) as date, SUM(value) as amount
            from public.transaction
            where type=$1
            group by substring(cast(date as varchar) from 1 for 10);
        `,
      [type],
    );
  };

  public save = async (transaction: Transaction): Promise<Transaction | null> => {
    const transactionDao = this.transactionMapper.toEntity(transaction);
    return this.transactionMapper.toDomain(await this.transactionRepository.save(transactionDao));
  };
}
