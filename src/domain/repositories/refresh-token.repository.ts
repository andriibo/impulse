import { RefreshTokenEntity } from 'domain/entities/refresh-token.entity';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

export interface IRefreshTokenRepository {
  find(id: string): Promise<RefreshTokenEntity>;

  revokeByAccessTokenIds(accessTokenIds: string[]): Promise<UpdateResult>;

  create(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity>;
}

export const IRefreshTokenRepository = Symbol('IRefreshTokenRepository');
