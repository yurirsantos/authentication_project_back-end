import { Module } from '@nestjs/common';
import { UserController } from './controllers/app.users.controller';
import { AuthController } from './controllers/app.auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { AuthenticationService } from './services/authentication';
import { PassportJWT } from './services/passport-JWT';
import { TwilioSmsService } from './services/twilio-sms.service';
import { ChangeCodeController } from './controllers/app.changeCode.controller';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, AuthController, ChangeCodeController],
  providers: [
    PrismaService,
    AuthenticationService,
    PassportJWT,
    TwilioSmsService,
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
