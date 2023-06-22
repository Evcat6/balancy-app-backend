import { Exclude } from 'class-transformer';
import { Role } from 'src/common';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SubCategory } from '@/sub-categories/entities/sub-category.entity';

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
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: false, default: Role.User })
  role: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Exclude()
  @Column({ nullable: true })
  emailVerificationToken: string;

  @Exclude()
  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.user)
  subCategories: SubCategory[];

  constructor(user?: CreateUserDto) {
    if (!user) return;
    this.email = user.email;
    this.username = user.email
      .split('@')[0]
      .replace(/^\w/, (c) => c.toUpperCase());
  }
}
