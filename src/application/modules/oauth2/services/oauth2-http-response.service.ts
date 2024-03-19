import { ClientEntity } from 'domain/entities';
import { OAuth2HttpResponseDto } from 'src/domain/dto/responses/oauth2';
import { ScopeEntity } from 'domain/entities/scope.entity';

export interface IOAuth2HttpResponseService {
  generateHttpResponse(
    client: ClientEntity,
    scopes: ScopeEntity[],
    userId?: string,
  ): Promise<OAuth2HttpResponseDto>;
}

export const IOAuth2HttpResponseService = Symbol(
  'IOAuth2HttpResponseService',
);
