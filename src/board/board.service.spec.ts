import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardMembers } from './entities/board-member.entity';


const createBoardDto: CreateBoardDto = {
  name:'testcode',
  background_color: '#FF0000'
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

const mockRepository = ():MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
})


describe('BoardService', () => {
  let service: BoardService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let mockBoardRepository : MockRepository<Board>
  let mockBoardMemberRepository: MockRepository<BoardMembers>

  


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
      {
        provide: getRepositoryToken(Board),
        useValue: mockRepository()
      },
      {
        provide: getRepositoryToken(BoardMembers),
        useValue: mockRepository()
      },
      {
        provide: DataSource,
        useValue: {
          createQueryRunner: jest.fn().mockReturnValue({
            connect: jest.fn(), 
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: {
              save:jest.fn(),
            }
          })
        }
      }
    ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    dataSource = module.get<DataSource>(DataSource)
    mockBoardRepository = module.get(getRepositoryToken(Board))
    mockBoardMemberRepository = module.get(getRepositoryToken(BoardMembers))
  });

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    dataSource.createQueryRunner = () => queryRunner;
    //프로 미스형태로 resolove 를 반환하게 한다
    //DB연결 해제할떄 동작을 모방하기 위해 사용함
    // 이걸 통해 release 메서드가 호출될때 에러갈 발생하지 않도록 보장을함
    queryRunner.release = () => Promise.resolve()
  })


  it('should transaction succeed',async() => {
    //GIVEN
    const userId = 1;
    const Board = {id:1, ...createBoardDto, ownerId: userId} 
    console.log(Board)
    const member = {userId, boardId:Board.id}

    mockBoardRepository.create.mockReturnValue(Board)
    queryRunner.manager.save(Board)
    mockBoardMemberRepository.create.mockReturnValue(member)
    queryRunner.manager.save(member)
    //WHEN
    const response = await service.create(userId, createBoardDto);  
    console.log(response)
    //THEN
    //쿼리 러너커넥이 실제로 실행이됬는지 확인하기
    expect(queryRunner.connect).toHaveBeenCalled();
    //쿼리러너 트랜잭션start가 실행됬는지 
    expect(queryRunner.startTransaction).toHaveBeenCalled();
    //보드를 생성할때 실제로 정의한 파라미터들과 함께 작동했는지
    expect(mockBoardRepository.create).toHaveBeenCalledWith({
        name:createBoardDto.name,
        background_color:createBoardDto.background_color,
        ownerId:userId
    })
    //결과값이 동일한지
    expect(response).toEqual(Board)
  });
}); 