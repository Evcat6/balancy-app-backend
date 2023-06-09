import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { instanceToInstance, instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });

    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const user = new User(createUserDto);
    user.password = await bcrypt.hash(createUserDto.password, 10); // Hash the password
    const createdUser = await this.usersRepository.save(user);
    return instanceToInstance(createdUser);
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return instanceToPlain(users);
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    return instanceToPlain(user);
  }

  findByEmail(email: string, isActive = true) {
    return this.usersRepository.findOneBy({ email, isActive });
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.usersRepository.softDelete(id);
    return result.affected > 0;
  }

  async restore(id: number): Promise<boolean> {
    const result = await this.usersRepository.restore(id);
    return result.affected > 0;
  }
}
