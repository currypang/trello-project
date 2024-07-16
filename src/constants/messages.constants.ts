export const MESSAGES_CONSTANT = {
  AUTH: {
    COMMON: {
      INVALID_TOKEN: '유효하지 않은 토큰 입니다.',
      HASH_ERROR: '비밀번호 해싱 중 오류가 발생했습니다.',
      CONFIRM_PASSWORD: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        INVALID_TYPE:
          '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 6자리 이상으로 입력해야 합니다.',
      },
    },
    SIGN_UP: {
      FAILED: '회원가입중 오류가 발생했습니다.',
      SUCCEED: '회원가입에 성공했습니다.',
      NOT_MATCHED_PASSWORD: '비밀번호가 일치 하지않습니다.',
      EXISTED_EMAIL: '이미 가입 된 이메일 입니다.',
      REQUIRED_NAME: '닉네임을 입력해주세요.',
      REQUIRED_EMAIL: '닉네임을 입력해주세요.',
      REQUIRED_PASSWORD: '비밀번호를 입력해 주세요.',
      INVALID_EMAIL: '이메일 형식에 맞지 않습니다.',
    },
    SIGN_IN: {
      SUCCEED: '로그인에 성공했습니다.',
    },
    STRATEGY: {
      UNAUTHORIZED_ERROR: '유효성 검사 중 오류가 발생했습니다.',
      UNAUTHORIZED: '일치하는 인증 정보가 없습니다.',
    },
    UPDATE_USER_PASSWORD: {
      NOT_MATCHED_NEW_PASSWORD: '새 비밀번호가 일치하지 않습니다.',
      SUCCEED: '비밀번호가 성공적으로 변경되었습니다.',
      FAILED: '비밀번호 업데이트 중 오류가 발생했습니다.',
    },
    DELETE_USER: {
      SUCCEED: '사용자 계정이 성공적으로 삭제되었습니다.',
      FAILED: '사용자 삭제 중 오류가 발생했습니다.',
    },
    REFRESH_TOKEN: {
      SUCCEED: '토큰이 성공적으로 발급 되었습니다.',
      EXPIRED: '토큰이 만료 되었습니다.',
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
      NOT_FOUND: '존재하지 않는 보드입니다.',
    },
    UPDATE_BOARD: {
      SUCCEED: '보드 수정에 성공했습니다',
      NOT_FOUND: '존재하지 않는 보드입니다.',
    },
    DELETE_BOARD: {
      SUCCEED: '보드 삭제에 성공했습니다',
      NOT_FOUND: '존재하지 않는 보드입니다.',
    },
  },

  CARD: {
    CREATE_CARD: {
      SUCCEED: '카드 생성에 성공했습니다',
      NOT_FOUND: '존재하지 않는 카드입니다.',
    },
    READ_CARDS: {
      SUCCEED: '카드 읽기에 성공했습니다',
      NOT_FOUND: '존재하지 않는 카드입니다.',
    },
    READ_CARD: {
      SUCCEED: '카드 읽기에 성공했습니다',
      NOT_FOUND: '존재하지 않는 카드입니다.',
    },
    UPDATE_CARD: {
      SUCCEED: '카드 수정에 성공했습니다',
      INVALID_TAPE: 'Invalid updateCardDto',
    },
    DELETE_CARD: {
      SUCCEED: '카드 삭제에 성공했습니다',
      NOT_FOUND: '존재하지 않는 카드입니다.',
    },
    CREATE_MEMBER_CARD: {
      SUCCEED: '카드 멤버 추가에 성공했습니다',
    },
    DELETE_MEMBER_CARD: {
      SUCCEED: '카드 멤버 삭제에 성공했습니다',
    },
    UPDATE_DATE_CARD: {
      SUCCEED: '카드 마감 설정에 성공했습니다',
    },
    UPDATE_DATE_EXPIRE_CARD: {
      SUCCEED: '카드가 마감 되었습니다',
      FAILED: '카드의 일정이 남아 있습니다',
    },
  },

  ACTIVITY: {
    CREATE_ACTIVITY: {
      SUCCEED: '액티비티 생성에 성공했습니다',
    },
    READ_ACTIVITY: {
      SUCCEED: '액티비티 조회에 성공했습니다',
    },
    UPDATE_ACTIVITY: {
      SUCCEED: '액티비티 수정에 성공했습니다',
    },
    DELETE_ACTIVITY: {
      SUCCEED: '액티비티 삭제에 성공했습니다',
    },
    CREATE_LOG_ACTIVITY: {
      SUCCEED: '로그 액티비티 생성에 성공했습니다',
    },
  },

  LIST: {
    COMMON: {
      BOARD_NOT_FOUND: '없는 보드입니다.',
      LIST_NOT_FOUND: '리스트를 찾을 수 없습니다.',
      FORBIDDEN: '보드에 가입된 유저가 아닙니다.',
      INVALID_POSITION: '옮길 수 있는 위치가 아닙니다.',

      NAME: {
        REQUIRED: '리스트 이름을 입력해 주세요.',
      },
      POSITION: {
        REQUIRED: '위치 번호를 입력해 주세요.',
      },
    },
    CREATE_LIST: {
      FAILED: '리스트 생성 중 에러가 발생했습니다.',
      SUCCEED: '리스트 생성에 성공했습니다.',
      NOT_FOUND: '존재하지 않는 보드입니다.',
    },
    UPDATE_LIST: {
      SUCCEED: '리스트 수정에 성공했습니다.',
    },
    DELETE_LIST: {
      SUCCEED: '리스트 삭제에 성공했습니다.',
      NOT_FOUND: '리스트를 찾을 수 없습니다.',
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
        CURRENT_REQUIRED: '현재 비밀번호를 입력해 주세요.',
        NEW_REQUIRED: '새로운 비밀번호를 입력해 주세요.',
        INVALID_TYPE:
          '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 6자리 이상으로 입력해야 합니다.',
      },
    },
    CONTROLLER: {
      FIND_ME: '내 정보 조회에 성공했습니다.',
    },
    SERVICE: {
      NOT_FOUND_USER: '사용자를 찾을 수 없습니다.',
    },
    SEND_EMAIL: {
      SUCCEED: '이메일로 인증링크를 보냈습니다.',
    },
    VERIFY_EMAIL: {
      SUCCEED: '메일 인증이 완료되었습니다.',
    },
  },
};
