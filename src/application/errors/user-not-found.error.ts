import { CustomError } from '../../shared/errors';

export class UserNotFoundError extends CustomError {
  statusCode = 401;

  constructor() {
    super();

    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: 'User was not found',
      },
    ];
  }
}
