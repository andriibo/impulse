import { BaseTokenEntity, ClientEntity } from 'domain/entities';
import { ScopeEntity } from 'domain/entities/scope.entity';
import { JwtPayload } from 'jsonwebtoken';

export interface IJwtTokenService {
  generate(
    accessToken: BaseTokenEntity,
    client: ClientEntity,
    scopes: ScopeEntity[],
    userId?: string,
  ): Promise<string>;

  decode(token: string): Promise<JwtPayload>;

  verify(token: string, publicKey: string): Promise<JwtPayload>;
}

export const IJwtTokenService = Symbol('IJwtTokenService');
