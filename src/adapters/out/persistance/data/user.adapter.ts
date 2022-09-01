import { Service } from 'typedi';
import { User } from '../../../../domain/aggregate';
import { AppDataSource } from '../../../../shared/data/config';
import { UserMapper } from '../mapper';

@Service()
export class UserAdapter {
  constructor(
    protected readonly userRepository = AppDataSource.getRepository(User),
    protected readonly userMapper: UserMapper,
  ) {}

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
