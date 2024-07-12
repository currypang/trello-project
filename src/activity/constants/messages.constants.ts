export const MESSAGES_CONSTANT = {
  AUTH: {
    COMMON: {
      CONFIRM_PASSWORD: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        INVALID_TYPE:
          '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 6자리 이상으로 입력해야 합니다.',
      },
    },
    SIGN_UP: {
      SUCCEED: '회원가입에 성공했습니다.',
      NOT_MATCHED_PASSWORD: '비밀번호가 일치 하지않습니다.',
      EXISTED_EMAIL: '이미 가입 된 이메일 입니다.',
    },
    SIGN_IN: {
      SUCCEED: '로그인에 성공했습니다.',
    },
    STRATEGY: {
      UNAUTHORIZED: '일치하는 인증 정보가 없습니다.',
    },
  },
  BOARD: {
    COMMON: {
      NAME: {
        REQUIRED: '보드 이름을 입력해 주세요.',
      },
      BACKGROUND_COLOR: {
        REQUIRED: '색상을 입력해 주세요.',
        INVALID_TYPE: '16진수형식으로 색을 입력해주세요(예:#FF0000)',
      },
    },
    CREATE_BOARD: {
      SUCCEED: '보드 생성에 성공하였습니다',
    },
    FIND_ALL_BOARD: {
      SUCCEED: '보드 목록 조회에 성공하였습니다',
    },
    FIND_DETAIL_BOARD: {
      SUCCEED: '보드 상세 조회에 성공하였습니다',
      NOT_FOUND: '존재하지 않은 보드입니다.',
    },
    UPDATE_BOARD: {
      SUCCEED: '보드 수정에 성공했습니다',
      NOT_FOUND: '존재하지 않은 보드입니다.',
    },
  },
  LIST: {
    COMMON: {
      NAME: {
        REQUIRED: '리스트 이름을 입력해 주세요.',
      },
      POSITION: {
        REQUIRED: '위치 ID를 입력해 주세요.',
      },
    },
  },

  USER: {
    COMMON: {
      USERNAME: {
        REQUIRED: '닉네임을 입력해 주세요.',
      },
      EMAIL: {
        REQUIRED: '이메일을 입력해 주세요.',
        INVALID_TYPE: '이메일 형식에 맞지 않습니다.',
      },
      PASSWORD: {
        REQUIRED: '비밀번호를 입력해 주세요.',
        INVALID_TYPE:
          '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 6자리 이상으로 입력해야 합니다.',
      },
    },
  },
};
