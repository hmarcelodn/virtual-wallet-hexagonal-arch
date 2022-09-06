import { inject, injectable } from 'inversify';
import { CreateUserPort } from '../../../../application/port/out';
import { User } from '../../../../domain/aggregate';
import { AppDataSource } from '../../../../shared/data/config';
import { TYPES } from '../../../../shared/di/types';
import { UserDao } from '../dao';
import { UserMapper } from '../mapper';

@injectable()
export class UserAdapter implements CreateUserPort {
  protected readonly userRepository = AppDataSource.getRepository(UserDao);

  constructor(@inject(TYPES.UserMapper) protected readonly userMapper: UserMapper) {}

  public create = async (user: User): Promise<User> => {
    let userDao = this.userMapper.toEntity(user);
    userDao = await this.userRepository.save(this.userMapper.toEntity(user));
    return this.userMapper.toDomain(userDao);
  };

  public findByEmail = async (email: string): Promise<User | null> => {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return user;
    }

    return this.userMapper.toDomain(user);
  };

  public findById = async (id: number): Promise<User | null> => {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return user;
    }

    return this.userMapper.toDomain(user);
  };

  public save = async (user: User): Promise<User | null> => {
    const userDao = this.userMapper.toEntity(user);
    return this.userMapper.toDomain(await this.userRepository.save(userDao));
  };
}
