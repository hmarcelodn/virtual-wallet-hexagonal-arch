import express, { Router } from 'express';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
  public abstract path: string;
  public router: Router;

  constructor() {
    this.router = express.Router();
  }

  protected abstract initializeRouter(): void;
}
