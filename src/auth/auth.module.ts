import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './services/otp.service';
import { OtpChallenge } from '../users/entities/otp-challenge.entity';
import { SmsService } from './services/sms.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtpChallenge])],
  controllers: [AuthController],
  providers: [AuthService, OtpService, SmsService],
})
export class AuthModule {}
