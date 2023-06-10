import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}
