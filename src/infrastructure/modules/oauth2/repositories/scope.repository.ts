import { Injectable } from '@nestjs/common';
import { IScopeRepository } from 'domain/repositories';
import { ScopeModel } from 'infrastructure/modules/oauth2/models/scope.model';
import { ScopeEntity } from 'domain/entities/scope.entity';
import { GrantTypeEnum, ScopeEnum } from 'domain/enums/oauth2';
import {OAuth2BadRequestError} from "application/modules/oauth2/errors";

@Injectable()
export class ScopeRepository implements IScopeRepository {
  findOrFail(id: string): ScopeEntity {
    if (!Object.values(ScopeEnum).includes(id as ScopeEnum)) {
      throw new OAuth2BadRequestError(`Cannot find the scope "${id}".`);
    }

    const scope = new ScopeModel();
    scope.id = id;

    return scope;
  }

  finalizeScopes(
    grantType: GrantTypeEnum,
    scopes: ScopeEntity[] = [],
  ): ScopeEntity[] {
    if (grantType === GrantTypeEnum.RefreshToken) {
      return [];
    }

    const scope = new ScopeModel();
    scope.id =
      grantType === GrantTypeEnum.Password
        ? ScopeEnum.User
        : ScopeEnum.Application;
    scopes.push(scope);

    return scopes;
  }
}
