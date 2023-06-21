// import { User } from 'src/users/entities/user.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

enum Type {
  Task = 'task',
  Event = 'event',
}

enum Prioryty {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  Urgent = 'urgent',
  Normal = 'normal',
  NonEssential = 'non-essential',
  Routine = 'routine',
}

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Type, default: Type.Task })
  tipe: Type;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column('simple-array')
  category: string[];

  @Column()
  subcategory: string;

  @Column({ type: 'enum', enum: Prioryty, default: Prioryty.Medium })
  prioryty: Prioryty;

  @Column({ default: true })
  pinned: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  completeDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  username: UserEntity;
}
