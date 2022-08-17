import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserDao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthDate: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  userIdentity: string;
}
