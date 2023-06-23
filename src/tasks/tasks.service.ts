import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskResponseInterface } from './types/types-response.interface';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async createTask(
    currentUser: User,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const task = new Task();
    Object.assign(task, createTaskDto);
    task.userId = currentUser.id;
    return await this.taskRepository.save(task);
  }

  findAll() {
    return `This action returns all tasks`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  update(id: number) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  async findOne(id: string): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  buildTaskResponse(task: Task): TaskResponseInterface {
    return { task };
  }
}
