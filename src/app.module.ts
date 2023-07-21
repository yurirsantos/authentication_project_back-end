import { Module } from '@nestjs/common';
import { UserController } from './controllers/app.users.controller';
import { AuthController } from './controllers/app.auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { AuthenticationService } from './services/authentication';
import { PassportJWT } from './services/passport-JWT';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [PrismaService, AuthenticationService, PassportJWT],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }