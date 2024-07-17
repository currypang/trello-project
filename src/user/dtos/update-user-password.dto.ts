import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';

export class UpdateUserPasswordDto {
  /**
   * 비밀번호 확인
   * @example "KimchiMaster123!@#"
   */
  @IsNotEmpty({ message: MESSAGES_CONSTANT.USER.COMMON.PASSWORD.CURRENT_REQUIRED })
  @IsStrongPassword(
    { minLength: 6 },
    {
      message: MESSAGES_CONSTANT.USER.COMMON.PASSWORD.INVALID_TYPE,
    }
  )
  currentPassword: string;

  /**
   * 새로운 비밀번호
   * @example "KimchiMaster1232332!@#"
   */
  @IsNotEmpty({ message: MESSAGES_CONSTANT.USER.COMMON.PASSWORD.NEW_REQUIRED })
  @IsStrongPassword(
    { minLength: 6 },
    {
      message: MESSAGES_CONSTANT.USER.COMMON.PASSWORD.INVALID_TYPE,
    }
  )
  newPassword: string;

  /**
   * 새로운 비밀번호 확인
   * @example "KimchiMaster1232332!@#"
   */
  @IsNotEmpty({ message: MESSAGES_CONSTANT.USER.COMMON.PASSWORD.NEW_REQUIRED })
  @IsStrongPassword(
    { minLength: 6 },
    {
      message: MESSAGES_CONSTANT.USER.COMMON.PASSWORD.INVALID_TYPE,
    }
  )
  confirmNewPassword: string;
}
