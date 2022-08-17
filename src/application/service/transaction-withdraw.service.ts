import { Service } from 'typedi';
import { PaymentType, Transaction } from '../../domain/aggregate';
import { TransactionService } from '../../domain/service';
import { OutOfBalanceError, UserNotFoundError } from '../errors';
import { CreateTransactionPort, LoadUserPort, LoadBalancePort } from '../port/out';

@Service()
export class TransactionWithdrawService {
  constructor(
    protected readonly transactionService: TransactionService,
    protected readonly loadUserPort: LoadUserPort,
    protected readonly getBalancePort: LoadBalancePort,
    protected readonly createTransactionPort: CreateTransactionPort,
  ) {}

  public withdraw = async (value: number, userId: number): Promise<Transaction | null> => {
    const user = await this.loadUserPort.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const totalBalance = await this.getBalancePort.getBalance(user);

    if (value > totalBalance) {
      throw new OutOfBalanceError();
    }

    const newWithdrawTrx = new Transaction();
    newWithdrawTrx.user = user;
    newWithdrawTrx.value = value;
    newWithdrawTrx.type = PaymentType.PAYMENT_WITHDRAW;

    return this.createTransactionPort.create(newWithdrawTrx);
  };
}
