import { Service } from 'typedi';
import { TokenBlackListDao } from '../dao';
import { AppDataSource } from '../../../../shared/data/config';
import {
  CreateBlackListedTokenPort,
  LoadBlackListerTokenPort,
} from '../../../../application/port/out';
import { TokenBlackList } from '../../../../domain/aggregate';
import { TokenBlackListMapper } from '../mapper';

@Service()
export class TokenBlackListAdapter implements LoadBlackListerTokenPort, CreateBlackListedTokenPort {
  constructor(
    protected readonly tokenBlackListRepository = AppDataSource.getRepository(TokenBlackListDao),
    protected readonly tokenBlackListMapper: TokenBlackListMapper,
  ) {}

  public getToken = async (token: string): Promise<TokenBlackList | null> => {
    const tokenDao = await this.tokenBlackListRepository.findOne({ where: { token } });
    return this.tokenBlackListMapper.toDomain(tokenDao);
  };

  public create = async (tokenBlackList: TokenBlackList): Promise<TokenBlackList> => {
    return this.tokenBlackListMapper.toDomain(
      await this.tokenBlackListRepository.save(tokenBlackList),
    );
  };
}
