import { User } from './user.aggregate';

export enum PaymentType {
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_MADE = 'payment_made',
  PAYMENT_WITHDRAW = 'payment_withdraw',
  PAYMENT_FILL = 'payment_fill',
}

export class Transaction {
  constructor() {
    this.date = new Date();
  }

  id: number;
  type: PaymentType;
  value: number;
  date: Date;
  user: User;
}
