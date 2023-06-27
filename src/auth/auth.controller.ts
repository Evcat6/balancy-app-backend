import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public, User } from 'src/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginUserDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  async login(@User() user) {
    return this.authService.login(user);
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // initiates the Google OAuth2 login flow
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@User() user) {
    // Here you can handle what to do after a successful login
    // return the user info or send a JWT token and redirect etc
    return this.authService.login(user);
  }

  @Public()
  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.usersService.verifyEmail(token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async loadUser(@User() user) {
    return await this.usersService.findById(user.id);
  }

  @Public()
  @Post('reset-password')
  requestPasswordReset(@Body('email') email: string) {
    return this.usersService.resetPassword(email);
  }

  @Public()
  @Post('set-password')
  async verifyPasswordReset(@Body() body: ChangePasswordDto) {
    const user = await this.usersService.setPassword(body.token, body.password);
    return this.authService.login(user);
  }
}
