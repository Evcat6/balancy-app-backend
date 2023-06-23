import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@/users/entities/user.entity';

import { CreateSubCategoryDto } from '../dto/create-sub-category.dto';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => User, (subCategory) => subCategory.subCategories)
  user: User;

  constructor(payload?: CreateSubCategoryDto) {
    if (!payload) return;
    this.name = payload.name;
  }
}
