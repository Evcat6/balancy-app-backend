import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateSubCategoryDto {
  @MinLength(3)
  @ApiProperty()
  readonly name: string;
}
