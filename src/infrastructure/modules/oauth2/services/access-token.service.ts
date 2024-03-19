import { AccessTokenEntity, ClientEntity } from 'domain/entities';
import { Inject, Injectable } from '@nestjs/common';
import { AccessTokenModel } from 'infrastructure/modules/oauth2/models';
import { IAccessTokenRepository } from 'domain/repositories';
import { AccessTokenSpecification } from 'application/modules/oauth2/specifications';
import { ScopeEntity } from 'domain/entities/scope.entity';
import { IAccessTokenService } from 'application/modules/oauth2/services/access-token.service';
import {
  OAuth2UnauthorizedError,
} from "application/modules/oauth2/errors/oauth2-unauthorized.error";

@Injectable()
export class AccessTokenService implements IAccessTokenService {
  constructor(
    @Inject(IAccessTokenRepository)
    protected readonly accessTokenRepository: IAccessTokenRepository,
    protected readonly accessTokenSpecification: AccessTokenSpecification,
  ) {}

  async create(
    client: ClientEntity,
    scopes: ScopeEntity[],
    userId?: string,
  ): Promise<AccessTokenEntity> {
    const accessToken = new AccessTokenModel();
    accessToken.clientId = client.id;
    accessToken.scopes = scopes.map((item) => item.id);
    accessToken.expiresAt = new Date(
      Date.now() + client.accessTokenLifetime * 1000,
    );
    if (userId) {
      accessToken.userId = userId;
    }

    return await this.accessTokenRepository.create(accessToken);
  }

  async verify(id: string): Promise<void> {
    const accessToken = await this.accessTokenRepository.find(id);
    if (!accessToken) {
      throw new OAuth2UnauthorizedError('Unauthorized.');
    }
    this.accessTokenSpecification.assertTokenIsExpired(accessToken);
    this.accessTokenSpecification.assertTokenRevoked(accessToken);
  }
}
