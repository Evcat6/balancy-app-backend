import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { instanceToInstance, instanceToPlain } from 'class-transformer';
import { randomBytes } from 'crypto';
import { CloudinaryService } from 'nestjs-cloudinary';
import { EmailService } from 'src/common';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private emailService: EmailService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });

    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const user = new UserEntity(createUserDto);
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.emailVerificationToken = await randomBytes(16).toString('hex');
    const createdUser = await this.usersRepository.save(user);

    this.emailService.sendEmailVerification(
      createdUser.email,
      createdUser.emailVerificationToken,
    );

    return instanceToInstance(createdUser);
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return instanceToPlain(users);
  }

  private async findUserBy(payload: Partial<any>) {
    const user = await this.usersRepository.findOneBy(payload);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findById(id: number) {
    const user = await this.findUserBy({ id });
    return instanceToPlain(user);
  }

  findByEmail(email: string, isActive = true) {
    return this.findUserBy({ email, isActive });
  }

  async verifyEmail(emailVerificationToken: string) {
    const user = await this.usersRepository.findOneBy({
      emailVerificationToken,
    });

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    const updatedUser = await this.usersRepository.save(user);

    return instanceToPlain(updatedUser);
  }

  async resetPassword(email: string) {
    const user = await this.findUserBy({ email });

    user.passwordResetToken = await randomBytes(20).toString('hex');
    const updatedUser = await this.usersRepository.save(user);

    this.emailService.sendPasswordReset(
      updatedUser.email,
      updatedUser.passwordResetToken,
    );

    return true;
  }

  async setPassword(passwordResetToken: string, password: string) {
    const user = await this.usersRepository.findOneBy({ passwordResetToken });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = null;

    return await this.usersRepository.save(user);
  }

  async resendEmailVerification(id: number) {
    const user = await this.findUserBy({ id });

    if (user.emailVerified) {
      throw new HttpException('Email already verified', HttpStatus.CONFLICT);
    }

    user.emailVerificationToken = await randomBytes(16).toString('hex');
    const updatedUser = await this.usersRepository.save(user);

    this.emailService.sendEmailVerification(
      updatedUser.email,
      updatedUser.emailVerificationToken,
    );

    return instanceToPlain(updatedUser);
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
        emailVerified: true,
      });
    }
    return user;
  }
}
