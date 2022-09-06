import { inject, injectable } from 'inversify';
import { PaymentType, Transaction } from '../../domain/aggregate';
import { TYPES } from '../../shared/di/types';
import { OutOfBalanceError, UserNotFoundError } from '../errors';
import { CreateTransactionPort, LoadUserPort, LoadBalancePort } from '../port/out';

@injectable()
export class TransactionWithdrawService {
  constructor(
    @inject(TYPES.LoadBalancePort) protected readonly loadBalancePort: LoadBalancePort,
    @inject(TYPES.LoadUserPort) protected readonly loadUserPort: LoadUserPort,
    @inject(TYPES.LoadBalancePort) protected readonly getBalancePort: LoadBalancePort,
    @inject(TYPES.CreateTransactionPort)
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
