import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { User } from 'src/user/entities/user.entity';

export class SignUpDto extends PickType(User, ['email', 'password', 'username']) {
  /**
   * 비밀번호 확인
   * @example "KimchiMaster123!@#"
   */
  @IsNotEmpty({ message: MESSAGES_CONSTANT.AUTH.COMMON.CONFIRM_PASSWORD.REQUIRED })
  @IsStrongPassword(
    { minLength: 6 },
    {
      message: MESSAGES_CONSTANT.AUTH.COMMON.CONFIRM_PASSWORD.INVALID_TYPE,
    }
  )
  confirmPassword: string;
}
