import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role, Roles, User } from 'src/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  getOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  updateMe(@User('id') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  updateUser(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post('resend-email-verification')
  resendEmailVerification(@User('id') userId: number) {
    return this.usersService.resendEmailVerification(userId);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  softDeleteMe(@User('id') id) {
    return this.usersService.softDelete(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  softDelete(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.softDelete(id);
  }

  @Post(':id/restore')
  @Roles(Role.Admin)
  restore(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.restore(id);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: /image\// }),
        ],
      }),
    )
    image,
    @User('id') userId: number,
  ) {
    const imageUrl = await this.usersService.uploadImage(image, userId);
    return imageUrl;
  }
}
