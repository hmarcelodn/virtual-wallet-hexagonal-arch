import { Service } from 'typedi';
import { TokenBlackList } from '../../../../domain/aggregate';
import { TokenBlackListDao } from '../dao';

@Service()
export class TokenBlackListMapper {
  public toDomain(tokenBlackListDao: TokenBlackListDao | null): TokenBlackList {
    const tokenBlackList = new TokenBlackList();
    return tokenBlackList;
  }

  public toEntity(tokenBlackList: TokenBlackList | null): TokenBlackListDao {
    const tokenBlackListDao = new TokenBlackListDao();
    return tokenBlackListDao;
  }
}
