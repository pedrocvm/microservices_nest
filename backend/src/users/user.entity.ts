import { hashPasswordTransform } from 'src/utils/encrypter';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({unique: true})
  email: string;

  @Column({
    transformer: hashPasswordTransform
  })
  password: string;
}
