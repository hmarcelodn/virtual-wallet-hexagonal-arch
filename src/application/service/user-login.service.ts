import { inject, injectable } from 'inversify';
import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import { InvalidUsernamePasswordError } from '../errors';
import { GENERAL } from '../../shared/constants';
import { LoadUserByEmailPort } from '../port/out';
import { TokenResponseDto, UserLoginDto } from '../dto';
import { TYPES } from '../../shared/di/types';

@injectable()
export class UserLoginService {
  constructor(
    @inject(TYPES.LoadUserByEmailPort) protected readonly loadUserByEmail: LoadUserByEmailPort,
  ) {}

  public login = async (model: UserLoginDto): Promise<TokenResponseDto> => {
    const user = await this.loadUserByEmail.findByEmail(model.email);

    if (!user) {
      throw new InvalidUsernamePasswordError();
    }

    const decryptedPassword = CryptoJS.AES.decrypt(user.password, GENERAL.ENCRYPTION_TOKEN);

    if (model.password !== decryptedPassword.toString(CryptoJS.enc.Utf8)) {
      throw new InvalidUsernamePasswordError();
    }

    const payload = {
      email: user.email,
      uuid: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.userIdentity,
    };

    const token = jwt.sign(payload, GENERAL.ENCRYPTION_TOKEN, {
      expiresIn: GENERAL.EXPIRATION_KEY,
    });

    return {
      token,
    };
  };
}
