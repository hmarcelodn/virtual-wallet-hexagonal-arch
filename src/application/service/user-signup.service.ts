import PasswordValidator from 'password-validator';
import { inject, injectable } from 'inversify';
import * as CryptoJS from 'crypto-js';
import { PasswordPolicyError, UserExistingError } from '../errors';
import { User } from '../../domain/aggregate';
import { UserSignupDto } from '../dto';
import { GENERAL } from '../../shared/constants';
import { LoadUserByEmailPort } from '../port/out';
import { CreateUserPort } from '../port/out/create-user.port';
import { TYPES } from '../../shared/di/types';

@injectable()
export class UserSignupService {
  constructor(
    @inject(TYPES.LoadUserByEmailPort) protected readonly loadUserByEmailPort: LoadUserByEmailPort,
    @inject(TYPES.CreateUserPort) protected readonly createUserPort: CreateUserPort,
  ) {}

  signup = async (userSignupInput: UserSignupDto): Promise<User | null> => {
    const schema = new PasswordValidator();
    schema
      .is()
      .min(8)
      .is()
      .max(25)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits()
      .has()
      .not()
      .spaces();

    if (!schema.validate(userSignupInput.password)) {
      throw new PasswordPolicyError();
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      userSignupInput.password,
      GENERAL.ENCRYPTION_TOKEN,
    );

    const newUser = new User();
    newUser.email = userSignupInput.email;
    newUser.birthDate = new Date(userSignupInput.birth_date);
    newUser.firstName = userSignupInput.first_name;
    newUser.lastName = userSignupInput.last_name;
    newUser.password = encryptedPassword.toString();
    newUser.userIdentity = userSignupInput.id;

    if (await this.loadUserByEmailPort.findByEmail(userSignupInput.email)) {
      throw new UserExistingError();
    }

    return this.createUserPort.create(newUser);
  };
}
