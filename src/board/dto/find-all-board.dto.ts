import { IsOptional, IsString } from "class-validator";

export class FindAllBoardDto {


    /**
     * 검색 키워드
     * @example "테스트"
     */
    @IsOptional()
    @IsString()
    keyword?:string;

}