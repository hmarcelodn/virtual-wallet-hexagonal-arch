import { ForecastProjectionResultDto } from '../../../adapters/out/persistance/dto';
import { User } from '../../../domain/aggregate';

export interface LoadTransactionsByLastDaysPort {
  getTransactionsByLastNDays(
    user: User,
    days: number,
    type: string,
  ): Promise<ForecastProjectionResultDto[]>;
}
