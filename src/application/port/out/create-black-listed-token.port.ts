import { TokenBlackList } from '../../../domain/aggregate';

export interface CreateBlackListedTokenPort {
  create(tokenBlackList: TokenBlackList): Promise<TokenBlackList>;
}
