import 'reflect-metadata';
import 'express-async-errors';
import Container from 'typedi';
import { App } from './app';

import { AppDataSource } from './shared/data/config';
import {
  HomeController,
  InformationController,
  TransactionController,
  UserController,
} from './adapters/in/web/controller';

const app = new App(Number(process.env.PORT) || 3000, [
  Container.get(UserController),
  Container.get(TransactionController),
  Container.get(InformationController),
  Container.get(HomeController),
]);

(async () => await AppDataSource.initialize())();

(() => {
  app.listen();
})();

process.on('SIGINT', () => {
  process.exit();
});
