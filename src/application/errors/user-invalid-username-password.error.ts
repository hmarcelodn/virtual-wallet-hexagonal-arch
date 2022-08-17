import { CustomError } from '../../shared/errors';

export class InvalidUsernamePasswordError extends CustomError {
  statusCode = 400;

  constructor() {
    super();

    Object.setPrototypeOf(this, InvalidUsernamePasswordError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: 'Invalid username/password',
      },
    ];
  }
}
