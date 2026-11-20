import { IsString, Matches } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/)
  user_mobile_num!: string;
}
