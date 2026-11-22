import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from '../guards/session-auth.guard';
import type { AuthenticatedRequest } from '../guards/session-auth.guard';
import { SendOtpDto } from '../dto/send-otp.dto';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  requestOtp(@Body() dto: SendOtpDto) {
    return this.authService.requestOtp(dto.user_mobile_num);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  me(@Req() request: AuthenticatedRequest) {
    return {
      user_id_num: request.authUser.user_id_num,
      user_mobile_num: request.authUser.user_mobile_num,
      is_user_verified: request.authUser.is_user_verified,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard)
  logout(@Req() request: AuthenticatedRequest) {
    return this.authService.logout(request.authSession);
  }
}
