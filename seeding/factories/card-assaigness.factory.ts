import { setSeederFactory } from 'typeorm-extension';

import { Faker } from '@faker-js/faker';
import { CardAssigness } from 'src/cards/entities/card-assigness.entity';

export default setSeederFactory(CardAssigness, async (faker: Faker) => {
  const cardAssignee = new CardAssigness();
  return cardAssignee;
});
