import { Service } from 'typedi';
import { PaymentType, Transaction } from '../../domain/aggregate';
import { UserNotFoundError } from '../errors';
import { LoadUserPort, CreateTransactionPort } from '../port/out';

@Service()
export class TransactionFillService {
  constructor(
    protected readonly loadUserPort: LoadUserPort,
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
