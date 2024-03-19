import { RemoveExpiredTokensCommand } from 'application/modules/oauth2/commands';
import { ICommandBus } from '@nestjs/cqrs/dist/interfaces';

export class RemoveExpiredTokensUseCase {
  constructor(private readonly commandBus: ICommandBus) {}

  async removeExpiredTokens(): Promise<void> {
    await this.commandBus.execute(new RemoveExpiredTokensCommand());
  }
}
