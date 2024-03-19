import { AccessTokenEntity, ClientEntity } from 'domain/entities';
import { ScopeEntity } from 'domain/entities/scope.entity';

export interface IAccessTokenService {
  create(
    client: ClientEntity,
    scopes: ScopeEntity[],
    userId?: string,
  ): Promise<AccessTokenEntity>;

  verify(id: string): Promise<void>;
}

export const IAccessTokenService = Symbol('IAccessTokenService');
