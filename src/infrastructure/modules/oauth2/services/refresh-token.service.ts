import { IRefreshTokenService } from 'application/modules/oauth2/services';
import { Inject, Injectable } from '@nestjs/common';
import { RefreshTokenModel } from 'infrastructure/modules/oauth2/models';
import { IRefreshTokenRepository } from 'domain/repositories';
import { RefreshTokenSpecification } from 'application/modules/oauth2/specifications';
import { RefreshTokenEntity } from 'domain/entities/refresh-token.entity';
import {
  OAuth2UnauthorizedError,
} from "application/modules/oauth2/errors/oauth2-unauthorized.error";

@Injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @Inject(IRefreshTokenRepository)
    protected readonly refreshTokenRepository: IRefreshTokenRepository,
    protected readonly refreshTokenSpecification: RefreshTokenSpecification,
  ) {}

  async create(
    accessTokenId: string,
    refreshTokenLifetime: number,
  ): Promise<RefreshTokenEntity> {
    const refreshToken = new RefreshTokenModel();
    refreshToken.accessTokenId = accessTokenId;
    refreshToken.expiresAt = new Date(Date.now() + refreshTokenLifetime * 1000);

    return await this.refreshTokenRepository.create(refreshToken);
  }

  async verify(id: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.find(id);

    if (!refreshToken) {
      throw new OAuth2UnauthorizedError(`RefreshToken not found.`);
    }

    this.refreshTokenSpecification.assertTokenIsRevoked(refreshToken);
    this.refreshTokenSpecification.assertTokenIsExpired(refreshToken);
  }
}
