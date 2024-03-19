import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {Inject} from '@nestjs/common';
import {GetUserInfoQuery} from "application/modules/user/queries";
import {IUserRepository} from "domain/repositories";
import {UserResponseDto} from "domain/dto/responses/user";
import {UserNotFoundError} from "application/modules/user/errors/user-not-found.error";

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
      throw new UserNotFoundError('User not found.');
    }

    return user;
  }
}
