import { IConsoleService } from 'application/modules/console/services';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { OAuth2UseCasesFactory } from 'infrastructure/modules/oauth2/factories';

@Injectable()
@Console()
export class ConsoleService implements IConsoleService {
  constructor(
    private readonly consoleLogger: ConsoleLogger,
    private readonly oauth2UseCasesFactory: OAuth2UseCasesFactory,
  ) {}

  @Command({
    command: 'create-client',
    options: [
      {
        flags: '-s, --scopes <scopes...>',
        required: true,
      },
      {
        flags: '-g, --grants <grants...>',
        required: false,
      },
    ],
    description: 'Create a new oauth2 client',
  })
  async createClient(options: {
    scopes: string[];
    grants?: string[];
  }): Promise<void> {
    this.consoleLogger.log('Creating new client starting...');
    console.log(options);

    const useCase = this.oauth2UseCasesFactory.createRegisterClientUseCase();
    await useCase.register(options);

    this.consoleLogger.log('Client created');
  }
}
