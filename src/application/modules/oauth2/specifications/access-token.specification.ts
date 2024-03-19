import { AccessTokenEntity } from 'domain/entities';
import {OAuth2UnauthorizedError} from "application/modules/oauth2/errors";

export class AccessTokenSpecification {
  assertTokenIsExpired(token: AccessTokenEntity): void {
    if (token.expiresAt < new Date(Date.now())) {
      throw new OAuth2UnauthorizedError('Access token expired.');
    }
  }

  assertTokenRevoked(token: AccessTokenEntity): void {
    if (token.revoked) {
      throw new OAuth2UnauthorizedError('Access token revoked.');
    }
  }
}
