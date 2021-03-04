import { BeforeInsert, Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
@Unique(['email', 'username'])
export class User extends BaseEntity {
  @Column({ nullable: false, type: 'varchar', length: 50 })
  username: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  displayname?: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  fullname: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  password: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  acessToken: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  refreshToken: string;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
