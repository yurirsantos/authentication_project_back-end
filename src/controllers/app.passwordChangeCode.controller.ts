/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Put,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  PasswordChangeCodeReplacePasswordType,
  PasswordChangeCodeType,
} from '../Types/PasswordChangeCodeType';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AuthenticationService } from 'src/services/authentication';
import { AuthGuard } from '@nestjs/passport';

const saltOrRounds = 10;

@Injectable()
@Controller()
export class PasswordChangeCodeController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly prisma: PrismaService, private authService: AuthenticationService) { }

  private async comparePasswords(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
  @Get('passwordChangeCodes')
  list() {
    return this.prisma.passwordChangeCodes.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  @Post('passwordChangeCodes/replacePassword')
  async listId(@Body() Body: PasswordChangeCodeReplacePasswordType) {
    const { code } = Body;
    let { password } = Body;
    const passwordChangeCode = await this.prisma.passwordChangeCodes.findFirst({
      where: {
        code: code,
      },
    });
    const today = new Date();

    if (today > passwordChangeCode.expirationDate) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Código expirado!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    password = await bcrypt.hash(password, saltOrRounds);

    const replacePassword = await this.prisma.users.update({
      where: {
        id: passwordChangeCode.userId,
      },
      data: {
        password,
      },
    });

    if (replacePassword) {
      return await this.prisma.passwordChangeCodes.update({
        where: {
          id: passwordChangeCode.id,
        },
        data: {
          status: true,
        },
      });
    }
  }
}
