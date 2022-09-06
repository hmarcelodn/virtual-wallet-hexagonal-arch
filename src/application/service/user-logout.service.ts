import { inject, injectable } from 'inversify';
import { TokenBlackList } from '../../domain/aggregate';
import { TYPES } from '../../shared/di/types';
import { LoadBlackListerTokenPort, CreateBlackListedTokenPort } from '../port/out';

@injectable()
export class UserLogoutService {
  constructor(
    @inject(TYPES.LoadBlackListerTokenPort)
    protected readonly getBlackListedTokenPort: LoadBlackListerTokenPort,
    @inject(TYPES.CreateBlackListedTokenPort)
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
