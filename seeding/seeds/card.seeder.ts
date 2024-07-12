import { Card } from 'src/cards/entities/card.entity';
import { List } from 'src/lists/entities/list.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class CardSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const listRepository = dataSource.getRepository(List);
    const lists = await listRepository.find();

    const cardFactory = factoryManager.get(Card);
    for (const list of lists) {
      const cards = await cardFactory.saveMany(5);
      for (const card of cards) {
        card.listId = list.id;
        await dataSource.getRepository(Card).save(card);
      }
    }
  }
}
