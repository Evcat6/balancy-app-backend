import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { EmailService } from 'src/common';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        cloud_name: configService.get('cloudinary.cloudName'),
        api_key: configService.get('cloudinary.apiKey'),
        api_secret: configService.get('cloudinary.apiSecret'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [EmailService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
