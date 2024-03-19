import { RefreshTokenEntity } from 'domain/entities/refresh-token.entity';
import {OAuth2UnauthorizedError} from "application/modules/oauth2/errors/oauth2-unauthorized.error";

export class RefreshTokenSpecification {
  assertTokenIsExpired(token: RefreshTokenEntity): void {
    if (token.expiresAt < new Date(Date.now())) {
      throw new OAuth2UnauthorizedError('Refresh token expired.');
    }
  }

  assertTokenIsRevoked(token: RefreshTokenEntity): void {
    if (token.revoked) {
      throw new OAuth2UnauthorizedError('Refresh token revoked.');
    }
  }

  assertTokenRelatedToAudience(aud: string, clientId: string): void {
    if (aud !== clientId) {
      throw new OAuth2UnauthorizedError(
        'You are not allowed to access the given resource.');
    }
  }
}
