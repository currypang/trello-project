# 🗒️ trello-project

칸반보드를 활용한 협업툴 제작 프로젝트

# 📝 설치 및 실행

- 필요한 패키지 설치

```sh
npm install
```

- 서버 실행

```sh
npm run start
```

- 서버 실행 (개발용)

```sh
npm run start:dev
```

## 📜 프로젝트 기획 및 설계

- ### 와이어 프레임

![image](https://github.com/user-attachments/assets/3c32956a-1fd4-4a70-ac85-09d0d9778feb)

- ### ERD

![image](https://github.com/user-attachments/assets/4d2f9205-072f-4279-a61a-cb66ae159aa7)

- ### 코드 컨벤션

  ![image](https://github.com/user-attachments/assets/94e85a5f-67e7-4409-848e-3abdb8117ea6)

- ### 깃헙 룰

  ![image](https://github.com/user-attachments/assets/19727930-f6d8-456a-b330-f6556ab5e387)

# 사용 스텍

![image](https://github.com/user-attachments/assets/88672fdf-7330-4751-b6fb-2b94f3870681)

# 📂 폴더 구조

```markdown
📦.github
┗ 📂workflows
┃ ┣ 📜trello-cd.yml
┃ ┗ 📜trello-ci.yml
📦seeding
┣ 📂factories
┃ ┣ 📜board-member.factory.ts
┃ ┣ 📜board.factory.ts
┃ ┣ 📜card-assaigness.factory.ts
┃ ┣ 📜card.factory.ts
┃ ┣ 📜list.factory.ts
┃ ┗ 📜user.factory.ts
┣ 📂seeds
┃ ┣ 📜board.seeder.ts
┃ ┣ 📜card-assigness.seeder.ts
┃ ┣ 📜card.seeder.ts
┃ ┣ 📜list.seeder.ts
┃ ┗ 📜user.seeder.ts
┗ 📜seeds.ts
📦src
┣ 📂activity
┃ ┣ 📂dto
┃ ┃ ┣ 📜create-activity.dto.ts
┃ ┃ ┗ 📜update-activity.dto.ts
┃ ┣ 📂entities
┃ ┃ ┗ 📜activity.entity.ts
┃ ┣ 📜activity.controller.spec.ts
┃ ┣ 📜activity.controller.ts
┃ ┣ 📜activity.module.ts
┃ ┣ 📜activity.service.spec.ts
┃ ┗ 📜activity.service.ts
┣ 📂auth
┃ ┣ 📂decorators
┃ ┃ ┗ 📜roles.decorator.ts
┃ ┣ 📂dtos
┃ ┃ ┣ 📜sign-in.dto.ts
┃ ┃ ┗ 📜sign-up.dto.ts
┃ ┣ 📂guards
┃ ┃ ┣ 📜jwt-auth.guard.ts
┃ ┃ ┣ 📜local-auth.guard.ts
┃ ┃ ┗ 📜roles.guard.ts
┃ ┣ 📂strategies
┃ ┃ ┣ 📜jwt.strategy.ts
┃ ┃ ┗ 📜local.strategy.ts
┃ ┣ 📜auth.controller.spec.ts
┃ ┣ 📜auth.controller.ts
┃ ┣ 📜auth.module.ts
┃ ┣ 📜auth.service.spec.ts
┃ ┗ 📜auth.service.ts
┣ 📂board
┃ ┣ 📂dto
┃ ┃ ┣ 📜create-board.dto.ts
┃ ┃ ┣ 📜find-all-board.dto.ts
┃ ┃ ┣ 📜invite-board.dto.ts
┃ ┃ ┗ 📜update-board.dto.ts
┃ ┣ 📂entities
┃ ┃ ┣ 📜board-member.entity.ts
┃ ┃ ┗ 📜board.entity.ts
┃ ┣ 📜board.controller.spec.ts
┃ ┣ 📜board.controller.ts
┃ ┣ 📜board.module.ts
┃ ┣ 📜board.service.spec.ts
┃ ┗ 📜board.service.ts
┣ 📂cards
┃ ┣ 📂dto
┃ ┃ ┣ 📜create-card.dto.ts
┃ ┃ ┣ 📜create-cardAssigness.dto.ts
┃ ┃ ┣ 📜delete-cardAssigness.dto.ts
┃ ┃ ┣ 📜update-card-order.dto.ts
┃ ┃ ┗ 📜update-card.dto.ts
┃ ┣ 📂entities
┃ ┃ ┣ 📜card-assigness.entity.ts
┃ ┃ ┗ 📜card.entity.ts
┃ ┣ 📜cards.controller.spec.ts
┃ ┣ 📜cards.controller.ts
┃ ┣ 📜cards.module.ts
┃ ┣ 📜cards.service.spec.ts
┃ ┗ 📜cards.service.ts
┣ 📂configs
┃ ┣ 📜database.config.ts
┃ ┗ 📜env-validation.config.ts
┣ 📂constants
┃ ┣ 📜auth.constants.ts
┃ ┣ 📜board.constants.ts
┃ ┣ 📜cards.constant.ts
┃ ┣ 📜lists.constans.ts
┃ ┣ 📜messages.constants.ts
┃ ┗ 📜user.constants.ts
┣ 📂email
┃ ┣ 📜email.module.ts
┃ ┣ 📜email.service.spec.ts
┃ ┗ 📜email.service.ts
┣ 📂invitation
┃ ┣ 📜invitation.module.ts
┃ ┣ 📜invitation.service.spec.ts
┃ ┗ 📜invitation.service.ts
┣ 📂lists
┃ ┣ 📂dto
┃ ┃ ┣ 📜create-list.dto.ts
┃ ┃ ┣ 📜update-list-order.dto.ts
┃ ┃ ┗ 📜update-list.dto.ts
┃ ┣ 📂entities
┃ ┃ ┗ 📜list.entity.ts
┃ ┣ 📜lists.controller.spec.ts
┃ ┣ 📜lists.controller.ts
┃ ┣ 📜lists.module.ts
┃ ┣ 📜lists.service.spec.ts
┃ ┗ 📜lists.service.ts
┣ 📂redis
┃ ┣ 📜redis.module.ts
┃ ┣ 📜redis.service.spec.ts
┃ ┗ 📜redis.service.ts
┣ 📂sse
┃ ┣ 📜sse.controller.spec.ts
┃ ┣ 📜sse.controller.ts
┃ ┣ 📜sse.module.ts
┃ ┣ 📜sse.service.spec.ts
┃ ┗ 📜sse.service.ts
┣ 📂user
┃ ┣ 📂dtos
┃ ┃ ┣ 📜delete-user.dto.ts
┃ ┃ ┣ 📜send-email.dto.ts
┃ ┃ ┣ 📜update-user-password.dto.ts
┃ ┃ ┗ 📜verify-email.query.dto.ts
┃ ┣ 📂entities
┃ ┃ ┗ 📜user.entity.ts
┃ ┣ 📂types
┃ ┃ ┗ 📜roles.type.ts
┃ ┣ 📜user.controller.spec.ts
┃ ┣ 📜user.controller.ts
┃ ┣ 📜user.module.ts
┃ ┣ 📜user.service.spec.ts
┃ ┗ 📜user.service.ts
┣ 📜app.controller.spec.ts
┣ 📜app.controller.ts
┣ 📜app.module.ts
┣ 📜app.service.ts
┗ 📜main.ts
📦test
┣ 📜app.e2e-spec.ts
┗ 📜jest-e2e.json
```

# 트러블 슈팅

## 1. EC2 CPU 100%

CI/CD 작업 중 CPU 100% 에 도달. SSH 접속 이 불가능했던 이슈가 발생하여 이를 해결하기 위해 두 가지 조치를 취했음.

- 무한 재시작을 방지하기 위해 max_restart 값을 설정. 이를통해 특정 시간 내에 최대 재시작 횟수를 제한하여 안정성을 높힘.

- 추가 메모리 확보를 위해 스왑 메모리를 활성.

## 2. TestCode(Transaction)

실제사용한 방식인 runner를 적용하지않고 connection으로 하는바람에 처음부터 다시 작성하는일이 생김

- SOF에서 관련 리퍼런스 참조 후, 상황에 맞는 방법을 사용해 테스트코드 작성함

## 3. 리스트 이동

요청값은 배열 인덱스 위치인데 Param값은 리스트나 카드의 id이니 작업하는데 은근 혼동이 왔고, 추가로 계산할 때 마지막 인덱스나 인덱스가 초과될 때 부분을 처리를 안해서 서버가 죽는 에러와 마지막 카드 계산을 덜해서 끝장 하나 앞에 들어오는 문제 발생

- 계산에 필요한 부분에 콘솔 넣어두고 나오는 값들 보면서 수정.

- 요청값과 카드 갯수가 일치하면 안되게, 에러처리 후 남은 계산은 첫장일때 중간일때 마지막일때 과정을 다시 돌아보면서 해결.

# 주요 기능 및 설명

## 1-1. 회원가입 API

- `이메일`, `비밀번호`, `비밀번호 확인`, `유저네임`을 `req.body`로 전달 받습니다.

- 보안을 위해 비밀번호는 `bcrypt`를 사용해 `Hash` 된 값을 저장합니다.

- 생성된 회원의 이메일을 DB 저장 후 반환합니다.

![회원가입 API](./imgs//1.%20회원가입.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/auth/auth.controller.ts#L26

## 1-2. 로그인 API

- `이메일, 비밀번호`를 `req.body`로 전달 받습니다.

- `AccessToken`(사용자 ID를 포함, 만료기한 `2시간`)을 생성합니다.

- `RefreshToken`(사용자 ID를 포함, 만료기한 `7일`)을 생성합니다.

- Refresh 토큰을 재발급 받고 DB에 저장합니다.

- AccessToken과 RefreshToken을 반환합니다.

![로그인 API](./imgs/2.%20로그인.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/auth/auth.controller.ts#L46

## 1-3. 이메일 인증 링크 전송 API

- `이메일`을 `req.body`로 전달 받습니다.

- `JwtAuthGuard`AuthGuard를 통해 `Access Token`를 검증합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 사용자의 id 값으로 토큰을 생성해 쿼리 값을 담은 링크를 전송합니다.

- 성공 시 메시지를 반환 합니다.

![이메일 인증 링크 전송 API](./imgs/3.%20이메일%20인증%20링크%20전송.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/auth/auth.controller.ts#L83

## 1-4. 이메일 인증 링크 확인 API

- 이메일 인증 링크 전송을 통해 해당 이메일로 링크를 전달 받습니다.

- 링크 클릭 시 사용자의 id 값으로 토큰을 생성해 쿼리 값을 담은 링크 확인 api를 요청합니다.

- 요청 시 DB에서 해당 유저의 인증 정보를 'verified'로 변경합니다.

![이메일 인증 링크 확인 API](./imgs/4.%20이메일%20인증%20링크%20확인.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/auth/auth.controller.ts#L95

### 1-5. 토큰 재발급 API

- `Refresh Token`를 새롭게 발급 API입니다.

- `Refresh Token`을 `Header`로 받아와서 `DB에 있는 토큰`과 비교합니다.

- 토큰 유효성 검사가 통과하면 새로운 Refresh 토큰을 재발급 받고 DB에 저장합니다.

- AccessToken과 RefreshToken을 DB 저장 후 반환합니다.

![토큰 재발급 API](./imgs/8.%20토큰%20재발급.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/auth/auth.controller.ts#L68

### 2-1. 유저 정보 조회 API

- 로그인한 유저의 정보를 조회하는 API입니다.

- `JwtAuthGuard`AuthGuard를 통해 `Access Token`를 검증합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 조회된 유저의 정보를 반환합니다.

![유저 정보 조회 API](./imgs/6.%20유저%20정보%20조회.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/user/user.controller.ts#L25

### 2-2. 비밀번호 변경 API

- 유저의 비밀번호를 수정하는 API입니다.

- `JwtAuthGuard`AuthGuard를 통해 `Access Token`를 검증합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 기존 비밀번호, 새로운 비밀번호, 새로운 비밀번호 확인을 `req.body`를 통해 받아옵니다.

- 수정 성공시 메시지를 반환합니다.

![ 비밀번호 변경 API](./imgs/5.%20비밀번호%20변경.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/user/user.controller.ts#L38

### 2-3. 유저 계정 삭제 API

- 유저의 정보를 삭제하는 API입니다.

- `JwtAuthGuard`AuthGuard를 통해 `Access Token`를 검증합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 비밀번호를 `req.body`를 통해 받아옵니다.

- 삭제 성공시 메시지를 반환합니다.

![유저 계정 삭제 API](./imgs/7.%20유저%20삭제.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/user/user.controller.ts#L49

### 2-4. 알림 목록 조회 API

- 알림 목록을 조회하는 API 입니다.

- `JwtAuthGuard`AuthGuard를 통해 `Access Token`를 검증합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 조회 성공시 목록과 메시지를 반환합니다.

![알림 목록 조회 API](./imgs/9.%20알림%20목록%20조회.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/user/user.controller.ts#L61

### 2-5. 알림 목록 삭제 API

- 알림 목록을 삭제하는 API 입니다.

- `JwtAuthGuard`AuthGuard를 통해 `Access Token`를 검증합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 삭제 성공시 목록과 메시지를 반환합니다.

![알림 목록 삭제 API](./imgs/10.%20알림%20목록%20삭제.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/user/user.controller.ts#L73

### 3-1. 보드 생성 API

- 보드를 생성하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- `name`, `background_color`를 `req.body`값으로 받아옵니다.

- 생성 성공시 메시지를 반환합니다.

![보드 생성 API](./imgs/11.%20보드%20생성.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/board/board.controller.ts#L44

### 3-2. 보드 목록 조회 API

- 보드 목록을 조회하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 조회 성공시 목록과 메시지를 반환합니다.

![보드 목록 조회 API](./imgs/12.%20보드%20목록%20조회.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/board/board.controller.ts#L62

### 3-3. 보드 상세 조회 API

- 보드 상세 정보를 조회하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- `board_id`값을 `path parameter`로 받아옵니다.

- 조회 성공시 보드 정보와 메시지를 반환합니다.

![보드 상세 조회 API](./imgs/13.%20보드%20상세%20조회.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/board/board.controller.ts#L81

### 3-3. 보드 수정 API

- 보드를 수정하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- `path parameter` 값으로 `boardId`를 받아옵니다.

- `name`, `background_color`를 `req.body`값으로 받아옵니다.

- 수정 성공시 보드 정보와 메시지를 반환합니다.

![보드 수정 API](./imgs/14.%20보드%20수정.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/board/board.controller.ts#L101

### 3-4. 보드 삭제 API

- 보드를 삭제하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- `board_id`값을 `path parameter`로 받아옵니다.

- 삭제 성공시 메시지를 반환합니다.

![보드 삭제 API](./imgs/15.%20보드%20삭제.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/board/board.controller.ts#L120

### 3-5. 보드 초대 API

- 보드에 유저를 초대하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- `email`, `board_id` 값을 `req.body`로 받아옵니다.

- 초대 성공시 보드 정보와 메시지를 반환합니다.

![보드 초대 API](./imgs/16.%20보드%20초대.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/board/board.controller.ts#L137

### 3-6. 보드 초대 확인 API

- 보드 초대 API를 통해 해당 이메일로 링크를 전달 받습니다.

- 링크 클릭 시 사용자의 id 값으로 토큰을 생성해 쿼리 값을 담은 링크 확인 api를 요청합니다.

- 요청 시 DB에서 `board_members`테이블에서 관련보드에 초대 수락한 유저를 멤버로 추가합니다.

![보드 초대 확인 API](./imgs/17.%20보드%20초대%20확인.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/board/board.controller.ts#L149

### 4-1. 리스트 생성 API

- 리스트를 생성하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 생성 가능합니다.

- `name`, `board_id`를 `req.body`값으로 받아옵니다.

- 생성 성공시 생성된 리스트와 메시지를 반환합니다.

![리스트 생성 API](./imgs/18.%20리스트%20생성.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/lists/lists.controller.ts#L35

### 4-2. 리스트 수정 API

- 리스트를 수정하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 수정 가능합니다.

- `list_id`값을 `path parameter`로 받아옵니다.

- `name`을 `req.body`값으로 받아옵니다.

- 수정 성공시 수정된 리스트와 메시지를 반환합니다.

![리스트 수정 API](./imgs/19.%20리스트%20수정.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/lists/lists.controller.ts#L53

### 4-3. 리스트 순서 변경 API

- 리스트의 순서를 변경하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 순서 변경 가능합니다.

- `list_id`값을 `path parameter`로 받아옵니다.

- 변경할 `position`을 `req.body`값으로 받아옵니다.

- 순서 변경 성공시 순서 변경된 리스트와 메시지를 반환합니다.

![리스트 순서 변경 API](./imgs/20.%20리스트%20순서%20변경.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/lists/lists.controller.ts#L87

### 4-4. 리스트 삭제 API

- 리스트를 삭제하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 삭제 가능합니다.

- `list_id`값을 `path parameter`로 받아옵니다.

- 변경할 `position`을 `req.body`값으로 받아옵니다.

- 삭제 성공시 삭제된 리스트와 메시지를 반환합니다.

![리스트 삭제 API](./imgs/21.%20리스트%20삭제.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/lists/lists.controller.ts#L70

### 5-1. 카드 생성 API

- 카드를 생성하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 생성 가능합니다.

- `name`, `description`,`color`,`listId`를 `req.body`값으로 받아옵니다.

- 생성 성공시 생성된 카드와 메시지를 반환합니다.

![카드 생성 API](./imgs/22.%20카드%20생성.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L44

### 5-2. 카드 상세 조회 API

- 카드를 상세 조회하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- `card_id`값을 `path parameter`로 받아옵니다.

- 조회 성공시 조회된 카드와 메시지를 반환합니다.

![카드 상세 조회 API](./imgs/23.%20카드%20상세%20조회.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L76

### 5-3. 카드 수정 API

- 카드를 수정하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 수정 가능합니다.

- `card_id`값을 `path parameter`로 받아옵니다.

- `name`, `description`,`color`,`startDate`, `dueDate`중 수정할 항목을 `req.body`값으로 받아옵니다.

- 수정 성공시 수정된 카드와 메시지를 반환합니다.

![카드 수정 API](./imgs/24.%20카드%20수정.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L95

### 5-4. 카드 멤버 추가 API

- 카드에 관여할 멤버를 추가 하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 멤버 추가 가능합니다.

- `card_id`값을 `path parameter`로 받아옵니다.

- `user_id` 값을 `req.body`값으로 받아옵니다.

- 멤버 추가 성공시 추가된 멤버와 메시지를 반환합니다.

![카드 멤버 추가 API](./imgs/25.%20카드%20멤버%20추가.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L135

### 5-5. 카드 멤버 삭제 API

- 카드에 관여할 멤버를 삭제 하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 멤버 삭제가 가능합니다.

- `card_id`값을 `path parameter`로 받아옵니다.

- `user_id` 값을 `req.body`값으로 받아옵니다.

- 멤버 삭제 성공시 삭제된 멤버와 메시지를 반환합니다.

![카드 멤버 삭제 API](./imgs/26.%20카드%20멤버%20삭제.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L161

### 5-6. 카드 위치 변경 API

- 리스트 내 카드의 위치를 변경하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 위치 변경이 가능합니다.

- `card_id`값을 `path parameter`로 받아옵니다.

- 위치를 변경 할`position` 값을 `req.body`값으로 받아옵니다.

- 위치 이동 성공시 위치 변경된 카드와 메시지를 반환합니다.

![카드 위치 변경 API](./imgs/27.%20카드%20위치%20이동.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L220

### 5-7. 카드 이동(다른 리스트로) API

- 다른 리스트로 카드의 위치를 변경하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 카드의 리스트 이동이 가능합니다.

- `card_id`. `list_id`값을 `path parameter`로 받아옵니다.

- 위치를 변경 할`position` 값을 `req.body`값으로 받아옵니다.

- 위치 이동 성공시 위치 변경된 카드와 메시지를 반환합니다.

![카드 이동(다른 리스트로) API](./imgs/28.%20카드%20리스트%20위치%20이동.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L246

### 5-8. 카드 삭제 API

- 카드를 삭제하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 카드삭제가 가능합니다.

- `card_id`를 `path parameter`로 받아옵니다.

- 삭제 성공시 삭제된 카드와 메시지를 반환합니다.

![카드 삭제 API](./imgs/29.%20카드%20삭제.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L115

### 5-9. 카드 마감 일자 업데이트 API

- 카드의 마감일자를 업데이트 하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 업데이트가 가능합니다.

- `card_id`를 `path parameter`로 받아옵니다.

- 업데이트 성공시 업데이트된 카드와 메시지를 반환합니다.

- `due_date`값을 `req.body`로 받아옵니다.

![카드 마감 일자 업데이트 API](./imgs/30.%20카드%20마감일자%20업데이트.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L179

### 5-10. 카드 마감 기능

- cron을 사용해 주기적으로 마감시간을 확인해 expire 처리 합니다.

- cron: 유닉스 계열 잡 스케줄러로, 고정된 시간, 날짜, 또는 간격으로 정해진 작업을 수행합니다.

![카드 마감 기능](./imgs/31.%20카드%20마감%20기능.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/cards/cards.controller.ts#L270

### 6-1. 댓글 생성 API

- 댓글을 생성하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 생성 가능합니다.

- `card_id`를 `path parameter`값으로 받아옵니다.

- `content`를 `req.body`값으로 받아옵니다.

- 생성 성공시 생성된 댓글과 메시지를 반환합니다.

![댓글 생성 API](./imgs/32.%20댓글%20생성.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/activity/activity.controller.ts#L24

### 6-2. 댓글 수정 API

- 댓글을 수정하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 수정 가능합니다.

- `card_id`를 `path parameter`값으로 받아옵니다.

- `content`를 `req.body`값으로 받아옵니다.

- 수정 성공시 수정된 댓글과 메시지를 반환합니다.

![댓글 수정 API](./imgs/33.%20댓글%20수정.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/activity/activity.controller.ts#L79

### 6-2. 댓글 삭제 API

- 댓글을 삭제하는 API 입니다.

- `RolesGuard`AuthGuard를 통해 `Access Token`를 검증하고, 인증된 유저만 접근 가능하게 합니다.

- 검증을 통과하면 `req.user`를 통해 사용자의 정보를 가져옵니다.

- 해당 보드 멤버에 속해 있는 인원만 수정 가능합니다.

- `card_id`를 `path parameter`값으로 받아옵니다.

- 삭제 성공시 메시지를 반환합니다.

![댓글 삭제 API](./imgs/34.%20댓글%20삭제.png)

<br>https://github.com/currypang/trello-project/blob/bb54813ec060e876e4c94f6c00f0088e7d8d98dd/src/activity/activity.controller.ts#L99

# 👥 프로젝트 제작 인원

![image](https://github.com/user-attachments/assets/8d1b3220-001e-4225-8ca1-f6dad8a99aa1)
