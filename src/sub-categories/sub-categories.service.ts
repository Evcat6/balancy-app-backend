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

  async findAll(userId: number) {
    const subCategories = await this.subcategoryRepository.findBy({ userId });
    return instanceToPlain(subCategories);
  }

  async findById(userId: number, id: number) {
    const subCategory = await this.subcategoryRepository.findOneBy({
      userId,
      id,
    });
    if (!subCategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }
    return instanceToPlain(subCategory);
  }

  private async exist(userId: number, categoryName: string) {
    const category = await this.subcategoryRepository.findOneBy({
      userId,
      name: categoryName,
    });
    return category;
  }

  async create(userId: number, payload: CreateSubCategoryDto) {
    const isCategoryExist = await this.exist(userId, payload.name);
    if (isCategoryExist) {
      throw new HttpException('Category already exists', HttpStatus.CONFLICT);
    }
    const newSubCategory = new SubCategory(payload);
    newSubCategory.userId = userId;

    this.subcategoryRepository.save(newSubCategory);

    const { userId: subCategoryUserId, ...subCategory } = newSubCategory;
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
