import { UnauthorizedException } from '@nestjs/common';
import { AccessTokenEntity } from 'domain/entities';

export class AccessTokenSpecification {
  assertTokenIsExpired(token: AccessTokenEntity): void {
    if (token.expiresAt < new Date(Date.now())) {
      throw new UnauthorizedException('Access token expired.');
    }
  }

  assertTokenRevoked(token: AccessTokenEntity): void {
    if (token.revoked) {
      throw new UnauthorizedException('Access token revoked.');
    }
  }
}
