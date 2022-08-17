import { Service } from 'typedi';
import { TokenBlackList } from '../../domain/aggregate';
import { LoadBlackListerTokenPort } from '../port/out';
import { CreateBlackListedTokenPort } from '../port/out/create-black-listed-token.port';

@Service()
export class UserLogoutService {
  constructor(
    protected readonly getBlackListedTokenPort: LoadBlackListerTokenPort,
    protected readonly createBlackListedTokenPort: CreateBlackListedTokenPort,
  ) {}

  public logout = async (token: string): Promise<void> => {
    if (!(await this.getBlackListedTokenPort.getToken(token))) {
      const newTokenToBlackList = new TokenBlackList();
      newTokenToBlackList.token = token;
      await this.createBlackListedTokenPort.create(newTokenToBlackList);
    }
  };
}
