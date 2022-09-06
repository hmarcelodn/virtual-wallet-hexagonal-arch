import { injectable } from 'inversify';
import { TokenBlackList } from '../../../../domain/aggregate';
import { TokenBlackListDao } from '../dao';

@injectable()
export class TokenBlackListMapper {
  public toDomain(tokenBlackListDao: TokenBlackListDao): TokenBlackList {
    const tokenBlackList = new TokenBlackList();
    tokenBlackList.id = tokenBlackListDao.id;
    tokenBlackList.token = tokenBlackListDao.token;
    return tokenBlackList;
  }

  public toEntity(tokenBlackList: TokenBlackList): TokenBlackListDao {
    const tokenBlackListDao = new TokenBlackListDao();
    tokenBlackListDao.id = tokenBlackList.id;
    tokenBlackListDao.token = tokenBlackList.token;
    return tokenBlackListDao;
  }
}
