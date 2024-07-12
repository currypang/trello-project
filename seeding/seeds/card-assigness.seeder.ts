import { BoardMembers } from 'src/board/entities/board-member.entity';
import { CardAssigness } from 'src/cards/entities/card-assigness.entity';
import { Card } from 'src/cards/entities/card.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class CardAssigneeSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const cardRepository = dataSource.getRepository(Card);
    const boardMemberRepository = dataSource.getRepository(BoardMembers);
    const cards = await cardRepository.find();
    const boardMembers = await boardMemberRepository.find();

    const cardAssigneeFactory = factoryManager.get(CardAssigness);
    for (const card of cards) {
      for (const boardMember of boardMembers) {
        const cardAssignee = await cardAssigneeFactory.save();
        cardAssignee.cardId = card.id;
        cardAssignee.userId = boardMember.userId;
        cardAssignee.card = card;
        cardAssignee.members = boardMember;
        await dataSource.getRepository(CardAssigness).save(cardAssignee);
      }
    }
  }
}
