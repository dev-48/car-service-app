import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataValidation, RegisterDataValidation } from './auth.dto';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDataValidation): Promise<object> {
    return this.AuthService.login(body);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() body: RegisterDataValidation): Promise<object> {
    return this.AuthService.register(body);
  }
}
