import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UpdateUserPasswordDto {
  /**
   * 비밀번호 확인
   * @example "KimchiMaster123!@#"
   */
  @IsNotEmpty({ message: '현재 비밀번호를 입력해 주세요.' })
  @IsStrongPassword(
    { minLength: 6 },
    {
      message: '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 6자리 이상으로 입력해야 합니다.',
    }
  )
  currentPassword: string;

  /**
   * 새로운 비밀번호
   * @example "KimchiMaster1232332!@#"
   */
  @IsNotEmpty({ message: '새로운 비밀번호를 입력해 주세요.' })
  @IsStrongPassword(
    { minLength: 6 },
    {
      message: '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 6자리 이상으로 입력해야 합니다.',
    }
  )
  newPassword: string;

  /**
   * 새로운 비밀번호 확인
   * @example "KimchiMaster1232332!@#"
   */
  @IsNotEmpty({ message: '새로운 비밀번호를 입력해 주세요.' })
  @IsStrongPassword(
    { minLength: 6 },
    {
      message: '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 6자리 이상으로 입력해야 합니다.',
    }
  )
  confirmNewPassword: string;
}
