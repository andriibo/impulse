import { RefreshTokenEntity } from 'domain/entities/refresh-token.entity';

export interface IRefreshTokenService {
  create(
    accessTokenId: string,
    refreshTokenLifetime: number,
  ): Promise<RefreshTokenEntity>;

  verify(id: string): Promise<void>;
}

export const IRefreshTokenService = Symbol('IRefreshTokenService');
