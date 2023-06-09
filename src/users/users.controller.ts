import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role, Roles } from 'src/common';

import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.usersService.update(+id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(+id);
  }

  @Post(':id/restore')
  @Roles(Role.Admin)
  restoreUser(@Param('id') id: number) {
    return this.usersService.restore(id);
  }
}
