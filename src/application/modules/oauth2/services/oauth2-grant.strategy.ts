import { OAuth2HttpRequestDto } from 'domain/dto/requests/oauth2/oauth2-http-request.dto';
import { OAuth2HttpResponseDto } from 'src/domain/dto/responses/oauth2';

/**
 * Implement this interfaces to provide an oauth2 grant type handler. Handlers must be registered using the
 * decorators @OAuth2Strategy('grant_type')
 */
export interface IOAuth2GrantStrategy {
  respondToAccessTokenRequest(
    request: OAuth2HttpRequestDto,
  ): Promise<OAuth2HttpResponseDto>;
}

export const IOAuth2GrantStrategy = Symbol('IOAuth2GrantStrategy');
