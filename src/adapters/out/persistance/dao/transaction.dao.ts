import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserDao } from './user.dao';

export enum PaymentTypeDao {
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_MADE = 'payment_made',
  PAYMENT_WITHDRAW = 'payment_withdraw',
  PAYMENT_FILL = 'payment_fill',
}

@Entity()
export class TransactionDao {
  constructor() {
    this.date = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['payment_received', 'payment_made', 'payment_withdraw', 'payment_fill'],
  })
  type: PaymentTypeDao;

  @Column({ type: 'decimal' })
  value: number;

  @Column()
  date: Date;

  @ManyToOne(() => UserDao, { cascade: true })
  user: UserDao;
}
