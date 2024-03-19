import { ScopeEntity } from 'domain/entities/scope.entity';
import { GrantTypeEnum } from 'domain/enums/oauth2';

export interface IScopeRepository {
  findOrFail(id: string): ScopeEntity;

  finalizeScopes(
    grantType: GrantTypeEnum,
    scopes?: ScopeEntity[],
  ): ScopeEntity[];
}

export const IScopeRepository = Symbol('IScopeRepository');
