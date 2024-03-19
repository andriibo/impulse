import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenEntity } from 'domain/entities/refresh-token.entity';

export class RefreshTokenSpecification {
  assertTokenIsExpired(token: RefreshTokenEntity): void {
    if (token.expiresAt < new Date(Date.now())) {
      throw new UnauthorizedException('Refresh token expired.');
    }
  }

  assertTokenIsRevoked(token: RefreshTokenEntity): void {
    if (token.revoked) {
      throw new UnauthorizedException('Refresh token revoked.');
    }
  }

  assertTokenRelatedToAudience(aud: string, clientId: string): void {
    if (aud !== clientId) {
      throw new UnauthorizedException(
        'You are not allowed to access the given resource.',
      );
    }
  }
}
