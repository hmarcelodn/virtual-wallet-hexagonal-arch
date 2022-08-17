import { DataSource } from 'typeorm';
import {
  ExchangeRateDao,
  TokenBlackListDao,
  TransactionDao,
  UserDao,
} from '../../../adapters/out/persistance/dao';
import {
  AddDateColumnTransaction1633102455108,
  ExchangeRateCreate1633109423860,
  TokenBlackListCreate1633008133169,
  TransactionAmountChangeToDecimal1634007905832,
  TransactionsCreate1633030060317,
  UserSchemaCreate1632942351633,
} from '../../../adapters/out/persistance/migration';
import { environment } from './environment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: environment.TYPEORM_HOST,
  port: Number(environment.TYPEORM_PORT),
  username: environment.TYPEORM_USERNAME,
  password: environment.TYPEORM_PASSWORD,
  database: environment.TYPEORM_DATABASE,
  synchronize: false,
  logging: true,
  entities: [ExchangeRateDao, TokenBlackListDao, TransactionDao, UserDao],
  migrations: [
    UserSchemaCreate1632942351633,
    TokenBlackListCreate1633008133169,
    TransactionsCreate1633030060317,
    AddDateColumnTransaction1633102455108,
    ExchangeRateCreate1633109423860,
    TransactionAmountChangeToDecimal1634007905832,
  ],
  migrationsRun: true,
});
