import { ClientEntity } from 'domain/entities';
import { OAuth2HttpResponseDto } from 'src/domain/dto/responses/oauth2';
import { Inject, Injectable } from '@nestjs/common';
import { ScopeEntity } from 'domain/entities/scope.entity';
import { IOAuth2HttpResponseService } from 'application/modules/oauth2/services/oauth2-http-response.service';
import { IAccessTokenService } from 'application/modules/oauth2/services/access-token.service';
import { IJwtTokenService, IRefreshTokenService } from 'application/modules/oauth2/services';

@Injectable()
export class OAuth2HttpResponseService implements IOAuth2HttpResponseService
{
  constructor(
    @Inject(IAccessTokenService)
    private readonly accessTokenService: IAccessTokenService,
    @Inject(IRefreshTokenService)
    private readonly refreshTokenService: IRefreshTokenService,
    @Inject(IJwtTokenService)
    private readonly jwtTokenService: IJwtTokenService,
  ) {}

  async generateHttpResponse(
    client: ClientEntity,
    scopes: ScopeEntity[],
    userId?: string,
  ): Promise<OAuth2HttpResponseDto> {
    const accessToken = await this.accessTokenService.create(
      client,
      scopes,
      userId,
    );
    const accessTokenJwt = await this.jwtTokenService.generate(
      accessToken,
      client,
      scopes,
      userId,
    );
    const expiresAt = ~~((accessToken.expiresAt.getTime() - Date.now()) / 1000);

    if (!userId) {
      return new OAuth2HttpResponseDto(accessTokenJwt, expiresAt);
    }

    const refreshToken = await this.refreshTokenService.create(
      accessToken.id,
      client.refreshTokenLifetime,
    );

    const refreshTokenJwt = await this.jwtTokenService.generate(
      refreshToken,
      client,
      scopes,
      userId,
    );

    return new OAuth2HttpResponseDto(accessTokenJwt, expiresAt, refreshTokenJwt);
  }
}
