import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
    name: 'project_title',
  })
  title: string;

  @Column('timestamp with time zone')
  date: Date;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  assignedUser: User;
}
