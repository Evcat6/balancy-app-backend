import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

import { User } from '@/users/entities/user.entity';

import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private subcategoryRepository: Repository<SubCategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findAll(userId: number) {
    const user = await this.findUserById(userId);
    const subCategories = await this.subcategoryRepository.findBy({ user });
    return instanceToPlain(subCategories);
  }

  async findById(userId: number, id: number) {
    const user = await this.findUserById(userId);
    const subCategory = await this.subcategoryRepository.findOneBy({
      user,
      id,
    });
    if (!subCategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }
    return instanceToPlain(subCategory);
  }

  private async isCategoryExist(user: User, categoryName: string) {
    const category = await this.subcategoryRepository.findOneBy({
      user,
      name: categoryName,
    });
    return category;
  }

  async create(userId: number, payload: CreateSubCategoryDto) {
    const user = await this.findUserById(userId);
    const isCategoryExist = await this.isCategoryExist(user, payload.name);
    if (isCategoryExist) {
      throw new HttpException('Category already exists', HttpStatus.CONFLICT);
    }
    const newSubCategory = new SubCategory(payload);
    newSubCategory.user = user;

    this.subcategoryRepository.save(newSubCategory);

    const { user: subCategoryUser, ...subCategory } = newSubCategory;
    return instanceToPlain(subCategory);
  }

  async update(
    userId: number,
    categoryId: number,
    payload: UpdateSubCategoryDto,
  ) {
    const subCategory = await this.findById(userId, categoryId);

    subCategory.name = payload.name;

    this.subcategoryRepository.save(subCategory);
    return instanceToPlain(subCategory);
  }

  async delete(userId: number, id: number) {
    const subCategory = await this.findById(userId, id);

    return this.subcategoryRepository.delete(subCategory);
  }
}
