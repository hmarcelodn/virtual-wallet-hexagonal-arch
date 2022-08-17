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
    return this.userMapper.toDomain(await this.userRepository.findOne({ where: { email } }));
  };

  public findById = async (id: number): Promise<User | null> => {
    return this.userMapper.toDomain(await this.userRepository.findOne({ where: { id } }));
  };

  public save = async (user: User): Promise<User | null> => {
    const userDao = this.userMapper.toEntity(user);
    return this.userMapper.toDomain(await this.userRepository.save(userDao));
  };
}
