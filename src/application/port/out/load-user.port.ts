import { User } from '../../../domain/aggregate';

export interface LoadUserPort {
  findById(id: number): Promise<User | null>;
}
