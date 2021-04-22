import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/users/user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  public async login(@Body() data: { email: string; password: string }) {
    const { email, password } = data;
    const response = await this.authService.validateUser(email, password);

    return {
      user: response.user,
      token: response.token,
    };
  }

  @Get('/me')
  async me(@User('id') userId: string) {
    return this.authService.me(userId);
  }
}
