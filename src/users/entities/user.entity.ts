import { Exclude } from 'class-transformer';
import { Role } from 'src/common';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: false, default: Role.User })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  constructor(user?: CreateUserDto) {
    if (!user) return;
    this.email = user.email;
    this.username = user.email
      .split('@')[0]
      .replace(/^\w/, (c) => c.toUpperCase());
  }
}
