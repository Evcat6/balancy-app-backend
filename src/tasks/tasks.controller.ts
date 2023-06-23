import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User as UserDecorator } from 'src/common';
import { User } from 'src/users/entities/user.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { TaskResponseInterface } from './types/types-response.interface';

@Controller('tasks')
@ApiTags('Tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(
    @UserDecorator() currentUser: User,
    @Body('task') createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseInterface> {
    const task = await this.tasksService.createTask(currentUser, createTaskDto);
    return this.tasksService.buildTaskResponse(task);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<TaskResponseInterface> {
    const task = await this.tasksService.findOne(id);
    return this.tasksService.buildTaskResponse(task);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.tasksService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
