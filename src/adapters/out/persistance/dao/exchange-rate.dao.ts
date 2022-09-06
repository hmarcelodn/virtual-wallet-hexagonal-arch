import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('exchange_rate')
export class ExchangeRateDao {
  constructor() {
    this.date = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quote: string;

  @Column({ type: 'decimal' })
  rate: number;

  @Column()
  date: Date;
}
