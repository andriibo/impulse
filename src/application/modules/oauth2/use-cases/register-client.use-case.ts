import { ClientEntity } from 'domain/entities';
import { RegisterClientRequestDto } from 'domain/dto/requests/oauth2';
import { RegisterClientCommand } from 'application/modules/oauth2/commands';
import { ICommandBus } from '@nestjs/cqrs/dist/interfaces';

export class RegisterClientUseCase {
  constructor(private readonly commandBus: ICommandBus) {}

  async register(dto: RegisterClientRequestDto): Promise<ClientEntity> {
    return await this.commandBus.execute(
      new RegisterClientCommand(dto.scopes, dto.grants),
    );
  }
}
