import { setSeederFactory } from 'typeorm-extension';

import { Faker } from '@faker-js/faker';
import { Card } from 'src/cards/entities/card.entity';

export default setSeederFactory(Card, async (faker: Faker) => {
  const card = new Card();
  card.name = faker.lorem.words(3);
  card.description = faker.lorem.sentences(2);
  card.color = faker.internet.color();
  card.position = faker.number.int({ min: 1, max: 1000 });
  card.startDate = faker.date.future();
  card.dueDate = faker.date.future();
  return card;
});
