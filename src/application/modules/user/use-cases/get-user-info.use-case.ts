import { IQueryBus } from '@nestjs/cqrs/dist/interfaces';
import {GetUserInfoQuery} from "application/modules/user/queries";
import {UserResponseDto} from "domain/dto/responses/user/user-response.dto";

export class GetUserInfoUseCase {
  constructor(private readonly queryBus: IQueryBus) {}

  async get(userId: string): Promise<UserResponseDto> {
    return await this.queryBus.execute(new GetUserInfoQuery(userId));
  }
}
