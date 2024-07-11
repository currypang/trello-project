import { Test, TestingModule } from '@nestjs/testing';
import { CardAssignessService } from './card-assigness.service';

describe('CardAssignessService', () => {
  let service: CardAssignessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardAssignessService],
    }).compile();

    service = module.get<CardAssignessService>(CardAssignessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
