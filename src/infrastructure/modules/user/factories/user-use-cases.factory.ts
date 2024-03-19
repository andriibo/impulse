import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {SignUpUseCase} from "application/modules/user/use-cases";

@Injectable()
export class UserUseCasesFactory {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  createSignUpUseCase(): SignUpUseCase {
    return new SignUpUseCase(this.commandBus);
  }
}
