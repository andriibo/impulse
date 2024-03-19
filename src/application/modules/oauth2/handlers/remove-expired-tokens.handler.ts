import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IAccessTokenRepository } from 'domain/repositories';
import { RemoveExpiredTokensCommand } from 'application/modules/oauth2/commands';

@CommandHandler(RemoveExpiredTokensCommand)
export class RemoveExpiredTokensHandler
  implements ICommandHandler<RemoveExpiredTokensCommand>
{
  constructor(
    @Inject(IAccessTokenRepository)
    private readonly accessTokenRepository: IAccessTokenRepository,
  ) {}

  async execute(command: RemoveExpiredTokensCommand): Promise<void> {
    const tokens = await this.accessTokenRepository.getExpiredTokens();

    await this.accessTokenRepository.remove(tokens);
  }
}
