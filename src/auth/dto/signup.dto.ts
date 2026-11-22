import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/)
  user_mobile_num!: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  user_password!: string;
}
