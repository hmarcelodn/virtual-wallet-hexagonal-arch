import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TokenBlackListDao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;
}
