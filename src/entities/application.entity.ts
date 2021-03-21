import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('applications')
@Unique(['name', 'apikey'])
export class Application extends BaseEntity {
  @Column({ nullable: false, type: 'varchar', length: 100 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 600 })
  apikey: string;

  @ManyToOne(() => User, (owner: User) => owner.applications, {
    cascade: true,
  })
  public owner: User;
}
