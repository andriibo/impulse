import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OAuth2HttpResponseDto } from 'domain/dto/responses/oauth2';
import { GetAccessTokenQuery } from 'application/modules/oauth2/queries';
import { OAuth2GrantStrategyRegistry } from 'application/modules/oauth2/strategies';

@QueryHandler(GetAccessTokenQuery)
export class GetAccessTokenHandler
  implements IQueryHandler<GetAccessTokenQuery>
{
  constructor(private readonly strategyRegistry: OAuth2GrantStrategyRegistry) {}

  async execute(command: GetAccessTokenQuery): Promise<OAuth2HttpResponseDto> {
    const { dto } = command;

    return await this.strategyRegistry.respondToAccessTokenRequest(dto);
  }
}
