import { Service } from 'typedi';
import { User } from '../../../../domain/aggregate';
import { UserDao } from '../dao';

@Service()
export class UserMapper {
  public toDomain = (userDao: UserDao | null): User => {
    const user = new User();
    return user;
  };

  public toEntity = (user: User | null): UserDao => {
    const userDao = new UserDao();
    return userDao;
  };
}
