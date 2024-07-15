import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { CreateBoardDto } from './dto/create-board.dto';
import { FindAllBoardDto } from './dto/find-all-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardService } from './board.service';
import { InvitationService } from 'src/invitation/invitation.service';
import { MESSAGES_CONSTANT } from 'src/constants/messages.constants';
import { HttpStatus } from '@nestjs/common';


//BoardService Mocking
const mockBoardServcie = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
 
}

//invitationService Mocking
const mockInvitationService = {
  sendEmail: jest.fn(),
  inviteMember: jest.fn(),
}

//Board생성 DTO
const createBoardDto: CreateBoardDto = {
  name:'testcode',
  background_color: '#FF0000'
};

//Board 전체조회 DTO
const findAllBoardDto: FindAllBoardDto= {
  keyword: 'test'
}

//Baord 수정 Dto
const updateBoardDtro: UpdateBoardDto = {
  name: 'testing',
  background_color: '#FF0013'
}



describe('BoardController', () => {
  let controller: BoardController;
  let service : BoardService;
  
  beforeEach(async () => {
    // 테스트 전 임시데이터 초기화 하는 작업
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetAllMocks();

    // 가짜 모듈 생성
    const module: TestingModule = await Test.createTestingModule({
      //imports:[TypeOrmModule.forFeature([Board, BoardMembers, CardAssigness, Activity]),InvitationModule,AuthModule],
      controllers: [BoardController],
      providers: [{provide: BoardService, useValue: mockBoardServcie},
                  {provide: InvitationService, useValue: mockInvitationService}
      ]
    }).compile();

  //생성한 가짜 모듈에서 (52번쨰 줄) service  와 controller 가져오기
    controller = module.get<BoardController>(BoardController);
    service = module.get<BoardService>(BoardService)
  });


  // 테스트 후 임시데이터를 초기화 하는 작업
  afterAll(async () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  })

  describe('create', ()=> {
    it('should create board', async()=> {
      //Given
      const createResult = {
          ownerId: 1,
          name: "testcode",
          background_color: '#FF0000',
          id: 1,
          createdAt: "2024-07-13T08:29:27.735Z",
          updatedAT: "2024-07-13T08:29:27.735Z",
          deletedAt: null
      }
      const req = {user: {id: 1}};

      //모킹한 서비스의 create 를 실행하면 createResult 값을 리턴하게 한다는 의미
      mockBoardServcie.create.mockResolvedValue(createResult)


      //When
      //실제로 컨트롤러의 메서드를 동작시키는 부분
      //컨트롤러 메서드의 매개변수로 req, creatBoardDto 를 사용
      //req는 사용자가 보드의 owner 인지 확인하기 위한 용도
      //실제 컨트롤러와 매개변수 순, 조건이 동일해야함
      const response = await controller.create(createBoardDto,req)
      
      //Then
      const expectedResult = {data: createResult, message:MESSAGES_CONSTANT.BOARD.CREATE_BOARD.SUCCEED, statusCode:HttpStatus.CREATED }
      //실제 테스트를 진행하는 파트
      //컨트롤러 메서드가 1바퀴만 돌았는지 확인하기(로직이 두번이상 실행되면 문제있음 ㅇㅇ)
      //mock fn에대해 테스트를한다/
      expect(mockBoardServcie.create).toHaveBeenCalledTimes(1)
      //컨트롤러의 실체 create 메서드의 결과가 createResult 와 같은지 확인
      expect(response).toEqual(expectedResult);
      //tobe =  obj를 비교할때 이걸사용하면 서로다른 obj만 값이같아도 저장된 주소가 다르기때문에
      //toEqual =  obj 의 실제 속에 key,Value 를 비교함
      //컨트롤러에서 서비스의 create 메서드를 사용할때 주어진 매개변수를 사용하는지 확인
      // 실제 보드컨트롤러 30번재줄과 비교해보면 이해하기 쉽습니다.
      expect(mockBoardServcie.create).toHaveBeenCalledWith(req.user.id,createBoardDto)
      //113에서 실패한 이유는 실제로 리턴값이 다르기때문(스테이터스 코드 , 리턴메세지)
      // createResult 는 서비스가 리턴하는거고 expectedResult  는 컨트롤러의 리턴값
    });
  })

  describe('findAll', () => {
    it('should get board list', async () =>{
      ///Given
      const findAllResult = [
        {
          id: 1,
          ownerId: 1,
          name: 'testcode',
          background_color:'#FF1234',
          createdAt:"2024-07-13T08:29:27.735Z",
          updatedAt: "2024-07-13T08:29:27.735Z"
        },
        {
          id: 2,
          ownerId: 1,
          name:'testcode',
          background_color:'#FF0000',
          createdAt:"2024-07-13T08:29:27.735Z",
          updatedAt: "2024-07-13T08:29:27.735Z"
        }
      ];
      const req = {user:{id:1}}
      //모킹된 서비스의 findall 메서드를 실행하면 findallresult 값을 반환한다는 의미
      mockBoardServcie.findAll.mockResolvedValue(findAllResult)

      //WHEN
      //실제 컨트롤러의 메서드를 동작시키는 부분
      //컨트롤러 메서드의 매백변수로 req 사용함
      // req 는 사용자가 보드맴버에 속해있는지 확인하기 위해 사용함
      const response =await controller.findAll(req,findAllBoardDto)

      //Then
      const expectedResult = { data: findAllResult,statusCode:HttpStatus.OK, message:MESSAGES_CONSTANT.BOARD.FIND_ALL_BOARD.SUCCEED}
      //테스트 진행하는부분
      //컨트롤러 메소드가 1번 실행됬는지 확인하기
      expect(mockBoardServcie.findAll).toHaveBeenCalledTimes(1)
      //findAll 의 결곽가 배열인지 확인하기
      //근데 이건 배열안의 객체인대 왜 OBJ로 인식을할까? 이 발칙한 테스트코드
      expect(response).toBeInstanceOf(Object)
      //컨트롤러의 실제 finall 메서드의 결과가 findallresult 와 같은지
      expect(response).toEqual(expectedResult)
      //실제 컨트롤러에서와 동일한 매개변수를 통해 사용하는지 체크하기
      expect(mockBoardServcie.findAll).toHaveBeenCalledWith(findAllBoardDto,req.user.id)
    })
  })
  describe('findOne', () => {
    it('should get board list', async () => {
    //Given
    const findOneResult = {
      id:1,
      ownerId:1,
      name:'testcode',
      background_color:'#FF0000',
      createdAt:"2024-07-13T08:29:27.735Z",
      updatedAt: "2024-07-13T08:29:27.735Z",
      deletedAt: null,
      members: [{
        id:1,
        userId:1,
        boardId:1
      }]
    }
    // 사용하는 파라미터는 userId 와 boardId 라서 추가함
    //parmas 는 보드Id를 통해 보드를 식별하기 위해 사용
    const req = {user:{id:1}, Params:{boardId:1}}
    //모킹된 서비스의 findOne 메서드를 실행하면 findOneresult 값을 반환한다는 의미
    mockBoardServcie.findOne.mockResolvedValue(findOneResult)
    
    //WHEN
    //req는 사용자가 보드의 owner인지 확인하는용도
    //parmas 는 보드Id를 통해 보드를 식별하기 위해 사용
    const response = await controller.findOne(req, req.Params.boardId)


    //THEN
    const expectedResult = { data : findOneResult, statusCode:HttpStatus.OK, message:MESSAGES_CONSTANT.BOARD.FIND_DETAIL_BOARD.SUCCEED}
    //테스트를 진행하는 파트
    //컨트롤러 매서드가 한번실행됬는지 확인
    expect(mockBoardServcie.findOne).toHaveBeenCalledTimes(1)
    //컨트롤러의 실제 findOne 의 결과가 expectedResult 와 같은지 확인
    expect(response).toEqual(expectedResult)
    //실제 컨트롤러에서와 동일한 매개변수를 통해 사용하는지 체크하기
    //boardId = req.params.boardId //파람으로 넘겨줬기때문에
    expect(mockBoardServcie.findOne).toHaveBeenCalledWith(req.Params.boardId,req.user.id )
    // 결과가 객체형태인지 확인하기
    expect(response).toMatchObject(response)
    })
  })

    describe('upate', () => {
      it('should update board', async() => {
        //GIVEN
        const updateResult = {
          id:1,
          ownerId:1,
          name:'testing',
          background_color:'#FF0013',
          createAt: '2024-07-13T08:29:27.735Z',
          updatedAt: '2024-07-13T08:29:27.735Z',
          deleteAt: null,
          members:[
            {
              id:1,
              userId:1,
              boardId:1,
            }
          ]
        }
        const req = {user: {id:1}, Params:{boardId:1}}

        mockBoardServcie.update.mockResolvedValue(updateResult);
        //WHEN
        const response = await controller.update(req,req.Params.boardId,updateBoardDtro)
        //THEN
        const expectedResult = {data:updateResult,statusCode:HttpStatus.OK,message:MESSAGES_CONSTANT.BOARD.UPDATE_BOARD.SUCCEED}
        //실제로 매서드가 한번실행됬는지
        expect(mockBoardServcie.update).toHaveBeenCalledTimes(1)
        //실제로 결과가 expected와 같은지
        expect(response).toEqual(expectedResult)
        //실제로 동작할때 매개변수를 사용하는지 체크하기
        expect(mockBoardServcie.update).toHaveBeenCalledWith(req.user.id,updateBoardDtro, req.Params.boardId)
      })
    })
});