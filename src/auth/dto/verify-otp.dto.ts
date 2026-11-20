import { IsInt, IsString, Matches, Min } from "class-validator";

export class VerifyOtpDto {
    @IsInt()
    @Min(1)
    otpChallengeIdNum!: number;

    @IsString()
    @Matches(/^\d{6}$/)
    otpCode!: string;
}