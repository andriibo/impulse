import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {Inject, NotFoundException} from '@nestjs/common';
import {GetUserInfoQuery} from "application/modules/user/queries";
import {IUserRepository} from "domain/repositories";
import {UserResponseDto} from "domain/dto/responses/user";

@QueryHandler(GetUserInfoQuery)
export class GeUserInfoHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: GetUserInfoQuery): Promise<UserResponseDto> {
    const { userId } = command;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
