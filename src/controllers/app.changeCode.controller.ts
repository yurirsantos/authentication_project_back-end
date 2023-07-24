/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Post,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ChangeCodeActiveAccountType,
  PasswordChangeCodeReplacePasswordType,
} from '../Types/ChangeCodeType';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AuthenticationService } from 'src/services/authentication';
import { AuthGuard } from '@nestjs/passport';

const saltOrRounds = 10;

@Injectable()
@Controller()
export class ChangeCodeController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly prisma: PrismaService, private authService: AuthenticationService) { }

  private async comparePasswords(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
  @Get('changeCodes')
  list() {
    return this.prisma.changeCodes.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  @Post('changeCodes/replacePassword')
  async replacePassword(@Body() Body: PasswordChangeCodeReplacePasswordType) {
    const { code } = Body;
    let { password } = Body;
    const passwordChangeCode = await this.prisma.changeCodes.findFirst({
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
      return await this.prisma.changeCodes.update({
        where: {
          id: passwordChangeCode.id,
        },
        data: {
          status: true,
        },
      });
    }
  }

  @Post('changeCodes/activeAccount')
  async activeAccount(@Body() Body: ChangeCodeActiveAccountType) {
    const { code } = Body;

    const changeCode = await this.prisma.changeCodes.findFirst({
      where: {
        code: code,
      },
    });
    const today = new Date();

    if (today > changeCode.expirationDate) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Código expirado!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const activeAccount = await this.prisma.users.update({
      where: {
        id: changeCode.userId,
      },
      data: {
        status: true,
      },
    });

    if (activeAccount) {
      return await this.prisma.changeCodes.update({
        where: {
          id: changeCode.id,
        },
        data: {
          status: true,
        },
      });
    }
  }
}
