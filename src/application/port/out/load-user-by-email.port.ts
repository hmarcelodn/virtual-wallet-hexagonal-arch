import { User } from '../../../domain/aggregate';

export interface LoadUserByEmailPort {
  findByEmail(email: string): Promise<User | null>;
}
