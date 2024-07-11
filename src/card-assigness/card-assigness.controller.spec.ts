import { Test, TestingModule } from '@nestjs/testing';
import { CardAssignessController } from './card-assigness.controller';
import { CardAssignessService } from './card-assigness.service';

describe('CardAssignessController', () => {
  let controller: CardAssignessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardAssignessController],
      providers: [CardAssignessService],
    }).compile();

    controller = module.get<CardAssignessController>(CardAssignessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
