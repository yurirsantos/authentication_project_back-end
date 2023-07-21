/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { UserType } from 'src/Types/UserType';
import * as bcrypt from 'bcrypt';

const FORBIDDEN_ERROR = {
  status: HttpStatus.FORBIDDEN,
  error: 'Forbidden',
};

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  private async findUserByEmail(email: string): Promise<UserType | null> {
    return this.prisma.users.findFirst({ where: { email } });
  }

  private async comparePasswords(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  async authenticate(email: string, password: string) {
    try {
      const user: UserType | null = await this.findUserByEmail(email);

      if (!user) {
        throw new HttpException(
          { ...FORBIDDEN_ERROR, error: 'User not found' },
          FORBIDDEN_ERROR.status,
        );
      }

      const isMatchPassword = await this.comparePasswords(
        password,
        user.password,
      );

      if (isMatchPassword) {
        const payload = { email: user.email, sub: user.password };
        const returnUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        };

        return {
          access_token: this.jwtService.sign(payload),
          user: returnUser,
        };
      } else {
        throw new HttpException(
          { ...FORBIDDEN_ERROR, error: 'Invalid email or password' },
          FORBIDDEN_ERROR.status,
        );
      }
    } catch (error) {
      throw new HttpException(
        { ...FORBIDDEN_ERROR, error: 'Authentication failed' },
        FORBIDDEN_ERROR.status,
      );
    }
  }
}
