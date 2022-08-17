import { User } from '../../../domain/aggregate';

export interface CreateUserPort {
  create(user: User): Promise<User>;
}
