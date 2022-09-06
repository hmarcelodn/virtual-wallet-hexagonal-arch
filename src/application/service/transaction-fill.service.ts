import { inject, injectable } from 'inversify';
import { PaymentType, Transaction } from '../../domain/aggregate';
import { TYPES } from '../../shared/di/types';
import { UserNotFoundError } from '../errors';
import { LoadUserPort, CreateTransactionPort } from '../port/out';

@injectable()
export class TransactionFillService {
  constructor(
    @inject(TYPES.LoadUserPort) protected readonly loadUserPort: LoadUserPort,
    @inject(TYPES.CreateTransactionPort)
    protected readonly createTransactionPort: CreateTransactionPort,
  ) {}

  public fill = async (value: number, userId: number): Promise<Transaction | null> => {
    const user = await this.loadUserPort.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const transaction = new Transaction();
    transaction.type = PaymentType.PAYMENT_FILL;
    transaction.value = value;
    transaction.user = user;

    return this.createTransactionPort.create(transaction);
  };
}
