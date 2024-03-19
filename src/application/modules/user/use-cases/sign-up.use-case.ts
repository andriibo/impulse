import { ICommandBus } from '@nestjs/cqrs/dist/interfaces';
import {SignUpRequestDto} from "domain/dto/requests/user";
import {SignUpCommand} from "application/modules/user/commands";

export class SignUpUseCase {
  constructor(private readonly commandBus: ICommandBus) {}

  async signUp(dto: SignUpRequestDto): Promise<void> {
    await this.commandBus.execute(new SignUpCommand(dto.email, dto.password));
  }
}
