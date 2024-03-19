import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientEntity } from 'domain/entities';
import { RegisterClientCommand } from 'application/modules/oauth2/commands';
import { IClientService } from 'application/modules/oauth2/services/client.service';

@CommandHandler(RegisterClientCommand)
export class RegisterClientHandler
  implements ICommandHandler<RegisterClientCommand>
{
  constructor(
    @Inject(IClientService)
    private readonly clientService: IClientService,
  ) {}

  async execute(command: RegisterClientCommand): Promise<ClientEntity> {
    const { scopes, grants, accessTokenLifetime, refreshTokenLifetime } =
      command;
    return await this.clientService.create(
      scopes,
      grants,
      accessTokenLifetime,
      refreshTokenLifetime,
    );
  }
}
