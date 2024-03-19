import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IAccessTokenRepository,
  IRefreshTokenRepository,
} from 'domain/repositories';
import { RevokeAccessTokenCommand } from 'application/modules/oauth2/commands';

@CommandHandler(RevokeAccessTokenCommand)
export class RevokeAccessTokenHandler
  implements ICommandHandler<RevokeAccessTokenCommand>
{
  constructor(
    @Inject(IAccessTokenRepository)
    private readonly accessTokenRepository: IAccessTokenRepository,
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(command: RevokeAccessTokenCommand): Promise<void> {
    const { id } = command;
    await this.accessTokenRepository.revoke([id]);
    await this.refreshTokenRepository.revokeByAccessTokenIds([id]);
  }
}
