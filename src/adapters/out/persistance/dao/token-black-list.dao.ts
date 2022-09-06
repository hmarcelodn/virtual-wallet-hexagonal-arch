import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token_black_list')
export class TokenBlackListDao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;
}
