import { CustomError } from '../../shared/errors';

export class CurrencyLayerError extends CustomError {
    statusCode = 400;
    
    constructor() {
        super();
    
        Object.setPrototypeOf(this, CurrencyLayerError.prototype);
      }
    

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{
            message: 'Error while fetching currencies from Currency Layer integration',
        }]
    }
}
