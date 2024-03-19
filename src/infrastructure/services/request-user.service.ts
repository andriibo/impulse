import { Inject, NotFoundException } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import {
  IJwtTokenService,
} from 'application/modules/oauth2/services';
import { IClientRepository } from 'domain/repositories';
import { ClientEntity } from 'domain/entities';
import { AccessTokenClaimsModel } from 'infrastructure/modules/oauth2/models/access-token-claims.model';
import { IAccessTokenService } from 'application/modules/oauth2/services/access-token.service';
import { IRequestUserModel } from 'application/modules/oauth2/models';
import { JwtPayloadModel } from 'infrastructure/modules/oauth2/models';

export class RequestUserService {
  public constructor(
    @Inject(IJwtTokenService)
    private readonly jwtTokenService: IJwtTokenService,
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
    @Inject(IAccessTokenService)
    private readonly accessTokenService: IAccessTokenService,
  ) {}

  public async getUserDataByHttpHeaders(
    headers: IncomingHttpHeaders,
  ): Promise<IRequestUserModel | null> {
    const accessToken: string = this.extractAccessToken(headers);
    if (!accessToken) {
      return null;
    }
    try {
      const payload = await this.jwtTokenService.decode(accessToken);
      await this.accessTokenService.verify(payload.jti);
      const client = await this.getClient(payload.aud as string);
      const tokenClaims = await this.jwtTokenService.verify(
        accessToken,
        client.publicKey,
      ) as JwtPayloadModel;
      return {
        accessToken,
        accessTokenClaims:
          AccessTokenClaimsModel.fromIdentityServerResponse(tokenClaims),
      };
    } catch {
      return null;
    }
  }

  private extractAccessToken(headers: IncomingHttpHeaders): string {
    const [type, token] = headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  private async getClient(clientId: string): Promise<ClientEntity> {
    const client = await this.clientRepository.find(clientId);
    if (!client) {
      throw new NotFoundException();
    }

    return client;
  }
}
