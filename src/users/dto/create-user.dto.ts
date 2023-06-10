import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  readonly password: string;
}
