/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { LoginType } from 'src/Types/LoginType';
import { AuthenticationService } from '../services/authentication';

@Controller()
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('auth')
  async authenticationLogin(@Body() loginData: LoginType) {
    const { login, password } = loginData;
    return this.authenticationService.authenticate(login, password);
  }
}
