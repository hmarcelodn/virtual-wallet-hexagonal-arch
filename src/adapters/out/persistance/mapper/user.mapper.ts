import { Service } from 'typedi';
import { User } from '../../../../domain/aggregate';
import { UserDao } from '../dao';

@Service()
export class UserMapper {
  public toDomain = (userDao: UserDao): User => {
    const user = new User();
    user.id = userDao.id;
    user.firstName = userDao.firstName;
    user.lastName = userDao.lastName;
    user.userIdentity = userDao.userIdentity;
    user.password = userDao.password;
    user.birthDate = userDao.birthDate;

    return user;
  };

  public toEntity = (user: User): UserDao => {
    const userDao = new UserDao();
    userDao.id = user.id;
    userDao.firstName = user.firstName;
    userDao.lastName = user.lastName;
    userDao.userIdentity = user.userIdentity;
    userDao.password = user.password;
    userDao.birthDate = user.birthDate;
    return userDao;
  };
}
