import { inject, injectable } from 'inversify';
import { PaymentType, Transaction } from '../../domain/aggregate';
import { TransactionService } from '../../domain/service';
import { AppDataSource } from '../../shared/data/config';
import { LoadUserPort, LoadUserByEmailPort, LoadBalancePort } from '../port/out';

import {
  OutOfBalanceError,
  SelfPaymentError,
  UserDestinationError,
  UserNotFoundError,
} from '../errors';
import { TYPES } from '../../shared/di/types';

@injectable()
export class TransactionPayService {
  constructor(
    @inject(TYPES.LoadBalancePort) protected readonly loadBalancePort: LoadBalancePort,
    @inject(TYPES.LoadUserPort) protected readonly loadUserPort: LoadUserPort,
    @inject(TYPES.LoadUserByEmailPort) protected readonly loadUserByEmailPort: LoadUserByEmailPort,
  ) {}

  public pay = async (value: number, srcUserId: number, destUserEmail: string): Promise<void> => {
    const srcUser = await this.loadUserPort.findById(srcUserId);
    if (!srcUser) {
      throw new UserNotFoundError();
    }

    if (srcUser.email === destUserEmail) {
      throw new SelfPaymentError();
    }

    const destUser = await this.loadUserByEmailPort.findByEmail(destUserEmail);
    if (!destUser) {
      throw new UserDestinationError();
    }

    const totalBalance = await this.loadBalancePort.getBalance(srcUser);

    if (value > totalBalance) {
      throw new OutOfBalanceError();
    }

    const srcTrx = new Transaction();
    srcTrx.type = PaymentType.PAYMENT_MADE;
    srcTrx.user = srcUser;
    srcTrx.value = value;

    const destTrx = new Transaction();
    destTrx.type = PaymentType.PAYMENT_RECEIVED;
    destTrx.user = destUser;
    destTrx.value = value;

    await AppDataSource.transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(srcTrx);
      await transactionEntityManager.save(destTrx);
    });
  };
}
