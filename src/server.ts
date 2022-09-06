import 'reflect-metadata';
import 'express-async-errors';
import { appContainer } from './shared/di';
import { App } from './app';
import { TYPES } from './shared/di/types';

import { AppDataSource } from './shared/data/config';
import {
  HomeController,
  InformationController,
  TransactionController,
  UserController,
} from './adapters/in/web/controller';

const app = new App(Number(process.env.PORT) || 3000, [
  appContainer.get<UserController>(TYPES.UserController),
  appContainer.get<TransactionController>(TYPES.TransactionController),
  appContainer.get<InformationController>(TYPES.InformationController),
  appContainer.get<HomeController>(TYPES.HomeController),
]);

(async () => { 
  await AppDataSource.initialize()
  await app.listen();
})();

process.on('SIGINT', () => {
  process.exit();
});
