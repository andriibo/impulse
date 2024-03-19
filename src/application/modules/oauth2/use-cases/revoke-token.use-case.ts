import { RevokeAccessTokenCommand } from 'application/modules/oauth2/commands';
import { RevokeTokenRequestDto } from 'domain/dto/requests/oauth2';
import { ICommandBus } from '@nestjs/cqrs/dist/interfaces';

export class RevokeTokenUseCase {
  constructor(private readonly commandBus: ICommandBus) {}

  async revoke(dto: RevokeTokenRequestDto): Promise<void> {
    await this.commandBus.execute(
      new RevokeAccessTokenCommand(dto.accessTokenId),
    );
  }
}
