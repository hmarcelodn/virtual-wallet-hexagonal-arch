import { Container } from 'inversify';
import {
  HomeController,
  InformationController,
  TransactionController,
  UserController,
} from '../../adapters/in/web/controller';
import { CurrencyLayerAdapter } from '../../adapters/out/integrations';
import {
  ExchangeRateAdapter,
  TokenBlackListAdapter,
  TransactionAdapter,
  UserAdapter,
} from '../../adapters/out/persistance/data';
import {
  ExchangeRateMapper,
  TokenBlackListMapper,
  TransactionMapper,
  UserMapper,
} from '../../adapters/out/persistance/mapper';
import {
  BulkSaveExchangeRatePort,
  CreateBlackListedTokenPort,
  CreateTransactionPort,
  CreateUserPort,
  LoadBalancePort,
  LoadBlackListerTokenPort,
  LoadDailyExchangeRatesPort,
  LoadExchangeRatePort,
  LoadPaymentTransactionsPort,
  LoadTransactionsByPeriodPort,
  LoadUserByEmailPort,
  LoadUserPort,
  SyncExchangeRatePort,
} from '../../application/port/out';
import { LoadTransactionsByLastDaysPort } from '../../application/port/out/load-transactions-by-last-days.port';
import {
  ExchangeRateService,
  InformationBalanceService,
  InformationForecastService,
  InformationSeriesService,
  InformationSummaryService,
  TransactionFillService,
  TransactionPayService,
  TransactionWithdrawService,
  UserLoginService,
  UserLogoutService,
  UserSignupService,
} from '../../application/service';
import { TransactionService } from '../../domain/service';
import { TYPES } from './types';

const appContainer = new Container();

// Controllers
appContainer.bind<HomeController>(TYPES.HomeController).to(HomeController);
appContainer.bind<InformationController>(TYPES.InformationController).to(InformationController);
appContainer.bind<TransactionController>(TYPES.TransactionController).to(TransactionController);
appContainer.bind<UserController>(TYPES.UserController).to(UserController);

// Application Services / Input ports
appContainer.bind<ExchangeRateService>(TYPES.ExchangeRateService).to(ExchangeRateService);
appContainer
  .bind<InformationBalanceService>(TYPES.InformationBalanceService)
  .to(InformationBalanceService);
appContainer
  .bind<InformationForecastService>(TYPES.InformationForecastService)
  .to(InformationForecastService);
appContainer
  .bind<InformationSeriesService>(TYPES.InformationSeriesService)
  .to(InformationSeriesService);
appContainer
  .bind<InformationSummaryService>(TYPES.InformationSummaryService)
  .to(InformationSummaryService);
appContainer.bind<TransactionFillService>(TYPES.TransactionFillService).to(TransactionFillService);
appContainer.bind<TransactionPayService>(TYPES.TransactionPayService).to(TransactionPayService);
appContainer
  .bind<TransactionWithdrawService>(TYPES.TransactionWithdrawService)
  .to(TransactionWithdrawService);
appContainer.bind<UserLoginService>(TYPES.UserLoginService).to(UserLoginService);
appContainer.bind<UserLogoutService>(TYPES.UserLogoutService).to(UserLogoutService);
appContainer.bind<UserSignupService>(TYPES.UserSignupService).to(UserSignupService);

// Output Ports
appContainer
  .bind<CreateBlackListedTokenPort>(TYPES.CreateBlackListedTokenPort)
  .to(TokenBlackListAdapter);
appContainer
  .bind<LoadBlackListerTokenPort>(TYPES.LoadBlackListerTokenPort)
  .to(TokenBlackListAdapter);
appContainer.bind<CreateTransactionPort>(TYPES.CreateTransactionPort).to(TransactionAdapter);
appContainer
  .bind<LoadDailyExchangeRatesPort>(TYPES.LoadDailyExchangeRatesPort)
  .to(ExchangeRateAdapter);
appContainer.bind<LoadExchangeRatePort>(TYPES.LoadExchangeRatePort).to(ExchangeRateAdapter);
appContainer
  .bind<LoadPaymentTransactionsPort>(TYPES.LoadPaymentTransactionsPort)
  .to(TransactionAdapter);
appContainer
  .bind<LoadTransactionsByLastDaysPort>(TYPES.LoadTransactionsByLastDaysPort)
  .to(TransactionAdapter);
appContainer
  .bind<LoadTransactionsByPeriodPort>(TYPES.LoadTransactionsByPeriodPort)
  .to(TransactionAdapter);
appContainer.bind<LoadUserByEmailPort>(TYPES.LoadUserByEmailPort).to(UserAdapter);
appContainer.bind<LoadUserPort>(TYPES.LoadUserPort).to(UserAdapter);
appContainer.bind<SyncExchangeRatePort>(TYPES.SyncExchangeRatePort).to(CurrencyLayerAdapter);
appContainer.bind<CreateUserPort>(TYPES.CreateUserPort).to(UserAdapter);
appContainer.bind<LoadBalancePort>(TYPES.LoadBalancePort).to(TransactionService);
appContainer.bind<BulkSaveExchangeRatePort>(TYPES.BulkSaveExchangeRatePort).to(ExchangeRateAdapter);

// Mappers
appContainer.bind<ExchangeRateMapper>(TYPES.ExchangeRateMapper).to(ExchangeRateMapper);
appContainer.bind<TokenBlackListMapper>(TYPES.TokenBlackListMapper).to(TokenBlackListMapper);
appContainer.bind<TransactionMapper>(TYPES.TransactionMapper).to(TransactionMapper);
appContainer.bind<UserMapper>(TYPES.UserMapper).to(UserMapper);

export { appContainer };
