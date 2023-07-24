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
import { ContactType } from '../Types/ContactType';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { AuthenticationService } from 'src/services/authentication';
import { AuthGuard } from '@nestjs/passport';

const saltOrRounds = 10;

@Injectable()
@Controller()
export class ContactController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly prisma: PrismaService, private authService: AuthenticationService) { }

  private async comparePasswords(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('contacts')
  list() {
    return this.prisma.contacts.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('contacts/:id')
  async listId(@Param('id') id: any) {
    try {
      const returnContact = await this.prisma.contacts.findFirst({
        where: {
          id: id,
        },
      });

      if (returnContact == null) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'No contact found!',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      return returnContact;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No contact found!',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('contacts')
  async create(
    @Body() Body: ContactType,
    @Headers('Authorization') authHeader: string,
  ) {
    const { codCountry, contact, userId } = Body;

    if (codCountry.length != 1) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cod country is invalid!',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (contact.length != 8) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Contact is invalid!',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      return await this.prisma.contacts.create({
        data: {
          id: randomUUID(),
          codCountry,
          contact,
          userRelation: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      let returnMessageError = 'Contact no registered!';

      if (error.meta.target == 'contact') {
        returnMessageError = 'Contato já cadastrado!';
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
  @Put('contacts/update/:id')
  async update(@Param('id') id: string, @Body() Body: ContactType) {
    const { codCountry, contact, userId } = Body;

    if (codCountry.length != 1) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Cod country is invalid!',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (contact.length != 8) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Contact is invalid!',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      return await this.prisma.contacts.update({
        where: {
          id: id,
        },
        data: {
          codCountry,
          contact,
          userRelation: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      let returnMessageError = 'Contact no registered!';

      if (error.meta.target == 'contact') {
        returnMessageError = 'Contato já cadastrado!';
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
  @Delete('contacts/delete/:id')
  async delete(@Param('id') id: string) {
    try {
      return await this.prisma.contacts.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'No contact found!',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
