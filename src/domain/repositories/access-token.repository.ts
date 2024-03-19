import { AccessTokenEntity } from 'domain/entities';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { AccessTokenModel } from 'infrastructure/modules/oauth2/models';

export interface IAccessTokenRepository {
  find(id: string): Promise<AccessTokenEntity>;

  create(accessToken: AccessTokenEntity): Promise<AccessTokenEntity>;

  findValidTokensByUserId(userId: string): Promise<AccessTokenEntity[]>;

  delete(id: string): Promise<DeleteResult>;

  getExpiredTokens(): Promise<AccessTokenEntity[]>;

  revoke(ids: string[]): Promise<UpdateResult>;

  remove(entities: AccessTokenModel[]): Promise<void>;
}

export const IAccessTokenRepository = Symbol('IAccessTokenRepository');
