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

![image](https://github.com/user-attachments/assets/5fbfc717-d5e5-499c-abfc-88d5e2421697)


![image](https://github.com/user-attachments/assets/82a12814-14bc-4f8b-95a9-4fde4390292b)




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





















# 👥 프로젝트 제작 인원
![image](https://github.com/user-attachments/assets/8d1b3220-001e-4225-8ca1-f6dad8a99aa1)












