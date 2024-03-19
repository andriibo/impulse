import { Injectable } from '@nestjs/common';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {GetUserInfoUseCase, SignUpUseCase} from "application/modules/user/use-cases";

@Injectable()
export class UserUseCasesFactory {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  createSignUpUseCase(): SignUpUseCase {
    return new SignUpUseCase(this.commandBus);
  }

  createGetUserInfoUseCase(): GetUserInfoUseCase {
    return new GetUserInfoUseCase(this.queryBus);
  }
}
