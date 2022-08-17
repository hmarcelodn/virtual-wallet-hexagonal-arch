export class ExchangeRate {
  constructor() {
    this.date = new Date();
  }

  id: number;
  quote: string;
  rate: number;
  date: Date;
}
