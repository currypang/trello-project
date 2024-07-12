import { BoardMembers } from 'src/board/entities/board-member.entity';
import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
export default class BoardSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.find();

    const boardFactory = factoryManager.get(Board);
    const boards = await boardFactory.saveMany(5); // 여러 보드를 생성

    const boardMemberRepository = dataSource.getRepository(BoardMembers);
    for (const board of boards) {
      board.ownerId = users[0].id; // 첫 번째 유저를 소유자로 설정
      await dataSource.getRepository(Board).save(board);

      // 모든 유저를 해당 보드의 멤버로 추가
      for (const user of users) {
        const boardMember = new BoardMembers();
        boardMember.user = user;
        boardMember.board = board;
        await boardMemberRepository.save(boardMember);
      }
    }
  }
}
