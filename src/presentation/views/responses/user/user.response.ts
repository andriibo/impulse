import { ApiProperty } from '@nestjs/swagger';
import {UserResponseDto} from "domain/dto/responses/user/user-response.dto";

export class UserResponse extends UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
