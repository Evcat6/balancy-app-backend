import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { instanceToInstance, instanceToPlain } from 'class-transformer';
import { CloudinaryService } from 'nestjs-cloudinary';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
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

  private async findOneBy(payload: unknown) {
    const user = await this.usersRepository.findOneBy(payload);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findById(id: number) {
    const user = await this.findOneBy({ id });
    return instanceToPlain(user);
  }

  findByEmail(email: string, isActive = true) {
    return this.findOneBy({ email, isActive });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return await this.usersRepository.save(user);
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.usersRepository.softDelete(id);
    return result.affected > 0;
  }

  async restore(id: number): Promise<boolean> {
    const result = await this.usersRepository.restore(id);
    return result.affected > 0;
  }

  async uploadImage(
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    const { secure_url } = await this.cloudinaryService.uploadFile(file);
    if (!secure_url) {
      throw new HttpException(
        'Error uploading image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    this.usersRepository.update(userId, { image: secure_url });
    return secure_url;
  }

  async findOrCreateFromGoogle({ email, username, picture }) {
    let user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      user = await this.usersRepository.save({
        email,
        username,
        image: picture,
        password: null,
      });
    }
    return user;
  }
}
