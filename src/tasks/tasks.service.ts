import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskResponseInterface } from './tipes/tipesResponse.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}
  async createTask(
    currentUser: UserEntity,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    const task = new TaskEntity();
    Object.assign(task, createTaskDto);
    task.username = currentUser;
    return await this.taskRepository.save(task);
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  buildTaskResponse(task: TaskEntity): TaskResponseInterface {
    return { task };
  }
}
