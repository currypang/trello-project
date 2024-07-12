import { setSeederFactory } from 'typeorm-extension';

import { Faker } from '@faker-js/faker';
import { BoardMembers } from 'src/board/entities/board-member.entity';

export default setSeederFactory(BoardMembers, async (faker: Faker) => {
  const boardMember = new BoardMembers();

  return boardMember;
});
