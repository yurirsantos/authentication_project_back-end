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
import { UserReplacePasswordType, UserType } from '../Types/UserType';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AuthenticationService } from 'src/services/authentication';
import { AuthGuard } from '@nestjs/passport';

const saltOrRounds = 10;

@Injectable()
@Controller()
export class UserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly prisma: PrismaService, private authService: AuthenticationService) { }

  private async comparePasswords(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  list() {
    return this.prisma.users.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updateAt: true,
      },
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users/:id')
  async listId(@Param('userId') userId: any) {
    try {
      const returnUser = await this.prisma.users.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updateAt: true,
        },
      });

      if (returnUser == null) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'No user found!',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return returnUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No user found!',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('users')
  async create(
    @Body() Body: UserType,
    @Headers('Authorization') authHeader: string,
  ) {
    const { email, name, acceptTerm, receiveOffers, contact } = Body;
    let { password } = Body;

    password = await bcrypt.hash(password, saltOrRounds);

    if (name.length <= 3) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Name is invalid!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const registerUser = await this.prisma.users.create({
        data: {
          id: randomUUID(),
          email,
          name,
          password,
          acceptTerm,
          receiveOffers,
        },
      });
      if (registerUser) {
        const registerContact = await this.prisma.contacts.create({
          data: {
            id: randomUUID(),
            codCountry: contact.codCountry,
            contact: contact.contact,
            userRelation: {
              connect: {
                id: registerUser.id,
              },
            },
          },
        });
        if (registerUser && registerContact) {
          return registerUser;
        }
      }
    } catch (error) {
      let returnMessageError = 'User no registered!';

      if (error.meta.target == 'email') {
        returnMessageError = 'E-mail já cadastrado!';
      }

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: returnMessageError,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('users/update/:userId')
  async update(@Param('userId') userId: string, @Body() Body: UserType) {
    const { email, name, acceptTerm, receiveOffers } = Body;

    if (name.length <= 3) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Name is invalid!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      return await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          email,
          name,
          acceptTerm,
          receiveOffers,
        },
      });
    } catch (error) {
      let returnMessageError = 'User no registered!';

      if (error.meta.target == 'email') {
        returnMessageError = 'E-mail já cadastrado!';
      }

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: returnMessageError,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('users/replacePassword/:userId')
  async replacePassword(
    @Param('userId') userId: string,
    @Body() Body: UserReplacePasswordType,
  ) {
    const { password } = Body;
    let { passwordNew } = Body;

    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
      },
    });

    const isMatchPassword = await this.comparePasswords(
      password,
      user.password,
    );

    if (isMatchPassword) {
      passwordNew = await bcrypt.hash(passwordNew, saltOrRounds);
      try {
        return await this.prisma.users.update({
          where: {
            id: userId,
          },
          data: {
            password: passwordNew,
          },
        });
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'User no registered!',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Incorrect previous password!',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('users/delete/:userId')
  async delete(@Param('userId') userId: string) {
    try {
      return await this.prisma.users.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No user found!',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
