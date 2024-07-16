import { IsEmail, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InviteDto {
    @ApiProperty({ example: 'example@example.com', description: 'Email address of the invitee' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ example: 1, description: 'ID of the board' })
    @IsNumber()
    boardId: number;
  }