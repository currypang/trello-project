import { IsJWT } from 'class-validator';

export class VerifyEmailQueryDto {
  @IsJWT()
  signupVerifyToken: string;
}
