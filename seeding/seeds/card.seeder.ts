import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Card } from 'src/cards/entities/card.entity';
import { List } from 'src/lists/entities/list.entity';
import { CardAssigness } from 'src/cards/entities/card-assigness.entity';
import { BoardMembers } from 'src/board/entities/board-member.entity';

export default class CardSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const listRepository = dataSource.getRepository(List);
    const boardMemberRepository = dataSource.getRepository(BoardMembers);

    const lists = await listRepository.find({ relations: ['board'] });
    const cardFactory = factoryManager.get(Card);
    const cardAssignessFactory = factoryManager.get(CardAssigness);

    for (const list of lists) {
      const boardMembers = await boardMemberRepository.find({
        where: { board: { id: list.board.id } },
      });

      const cards = await cardFactory.saveMany(5, { listId: list.id }); // 'listId'로 수정

      for (const card of cards) {
        for (const member of boardMembers) {
          cardAssignessFactory.save({
            card: card,
            userId: member.userId,
            cardId: card.id,
            members: member,
          });
        }
      }
    }
  }
}
