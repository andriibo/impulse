import { Injectable } from '@nestjs/common';
import {
  GetAccessTokenUseCase, RegisterClientUseCase, RemoveExpiredTokensUseCase, RevokeTokenUseCase
} from 'application/modules/oauth2/use-cases';
import {CommandBus, QueryBus} from '@nestjs/cqrs';

@Injectable()
export class OAuth2UseCasesFactory {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  createGetAccessTokenUseCase(): GetAccessTokenUseCase {
    return new GetAccessTokenUseCase(this.queryBus);
  }

  createRevokeTokenUseCase(): RevokeTokenUseCase {
    return new RevokeTokenUseCase(this.commandBus);
  }

  createRegisterClientUseCase(): RegisterClientUseCase {
    return new RegisterClientUseCase(this.commandBus);
  }

  createRemoveExpiredTokensUseCase(): RemoveExpiredTokensUseCase {
    return new RemoveExpiredTokensUseCase(this.commandBus);
  }
}
