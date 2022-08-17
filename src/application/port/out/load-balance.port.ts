import { User } from '../../../domain/aggregate';

export interface LoadBalancePort {
  getBalance(user: User): Promise<number>;
}
