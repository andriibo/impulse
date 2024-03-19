import { Inject } from '@nestjs/common';
import { OAuth2HttpRequestDto } from 'domain/dto/requests/oauth2/oauth2-http-request.dto';
import { ClientEntity } from 'domain/entities';
import { OAuth2GrantStrategy } from 'infrastructure/modules/oauth2/decorators';
import { RefreshTokenSpecification } from 'application/modules/oauth2/specifications';
import {
  IJwtTokenService,
  IRefreshTokenService,
} from 'application/modules/oauth2/services';
import { AbstractStrategy } from 'infrastructure/modules/oauth2/strategies/abstract.strategy';
import { IClientRepository, IScopeRepository } from 'domain/repositories';
import { OAuth2HttpResponseDto } from 'src/domain/dto/responses/oauth2';
import { IOAuth2HttpResponseService } from 'application/modules/oauth2/services/oauth2-http-response.service';
import { JwtPayloadModel } from 'infrastructure/modules/oauth2/models';

@OAuth2GrantStrategy('refresh_token')
export class RefreshTokenStrategy extends AbstractStrategy {
  constructor(
    @Inject(IOAuth2HttpResponseService)
    protected readonly oauth2HttpResponseService: IOAuth2HttpResponseService,
    @Inject(IScopeRepository)
    protected readonly scopeRepository: IScopeRepository,
    @Inject(IClientRepository)
    protected readonly clientRepository: IClientRepository,
    @Inject(IJwtTokenService)
    private readonly jwtTokenService: IJwtTokenService,
    private readonly refreshTokenSpecification: RefreshTokenSpecification,
    @Inject(IRefreshTokenService)
    private readonly refreshTokenService: IRefreshTokenService,
  ) {
    super(oauth2HttpResponseService, scopeRepository, clientRepository);
  }

  private async validateOldRefreshToken(
    refreshToken: string,
    client: ClientEntity,
  ): Promise<JwtPayloadModel> {
    const payload = await this.jwtTokenService.verify(
      refreshToken,
      client.publicKey,
    );
    this.refreshTokenSpecification.assertTokenRelatedToAudience(
      payload.aud as string,
      client.id,
    );
    await this.refreshTokenService.verify(payload.jti);

    return payload as JwtPayloadModel;
  }

  async respondToAccessTokenRequest(
    request: OAuth2HttpRequestDto,
  ): Promise<OAuth2HttpResponseDto> {
    const client = await this.getClientOrFail(request.clientId);
    await this.validateClient(request, client);
    const payload = await this.validateOldRefreshToken(
      request.refreshToken,
      client,
    );
    const scopes = await this.validateScopes(payload.scopes);

    return await this.oauth2HttpResponseService.generateHttpResponse(
      client,
        scopes,
      payload.sub,
    );
  }
}
