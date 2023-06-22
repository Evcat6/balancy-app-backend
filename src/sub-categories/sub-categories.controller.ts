import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { User } from '@/common/decorators';

import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoriesService } from './sub-categories.service';

@Controller('sub-categories')
@ApiTags('SubCategories')
@UseGuards(JwtAuthGuard)
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Get()
  getAll(@User('id') userId) {
    return this.subCategoriesService.findAll(userId);
  }

  @Get(':id')
  getById(
    @User('id') userId,
    @Param('id', new ParseIntPipe()) categoryId: number,
  ) {
    return this.subCategoriesService.findById(userId, categoryId);
  }

  @Post('')
  create(
    @User('id') userId: number,
    @Body() newSubCategory: CreateSubCategoryDto,
  ) {
    return this.subCategoriesService.create(userId, newSubCategory);
  }

  @Patch(':id')
  update(
    @User('id') userId: number,
    @Param('id', new ParseIntPipe()) categoryId: number,
    @Body() subCategory: UpdateSubCategoryDto,
  ) {
    return this.subCategoriesService.update(userId, categoryId, subCategory);
  }

  @Delete(':id')
  delete(
    @User('id') userId: number,
    @Param('id', new ParseIntPipe()) categoryId: number,
  ) {
    return this.subCategoriesService.delete(userId, categoryId);
  }
}
