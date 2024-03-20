import { OAuth2GrantStrategy } from 'infrastructure/modules/oauth2/decorators';
import { AbstractStrategy } from 'infrastructure/modules/oauth2/strategies/abstract.strategy';
import { OAuth2HttpRequestDto } from 'src/domain/dto/requests/oauth2';
import { OAuth2HttpResponseDto } from 'src/domain/dto/responses/oauth2';

@OAuth2GrantStrategy('client_credentials')
export class ClientCredentialsStrategy extends AbstractStrategy {
  async respondToAccessTokenRequest(
    request: OAuth2HttpRequestDto,
  ): Promise<OAuth2HttpResponseDto> {
    const client = await this.getClientOrFail(request.clientId);
    await this.validateClient(request, client);
    const scopes = this.scopeRepository.finalizeScopes(
      request.grantType,
    );
    return await this.oauth2HttpResponseService.generateHttpResponse(
      client,
      scopes,
    );
  }
}
