import {
  IAccessTokenClaimsModel,
} from 'application/modules/oauth2/models';
import { JwtPayloadModel } from 'infrastructure/modules/oauth2/models/jwt-payload.model';

class Claims {
  static readonly accessTokenId = 'jti';
  static readonly userId = 'sub';
  static readonly clientId = 'aud';
  static readonly tokenExpireTimestamp = 'exp';
  static readonly scopes = 'scopes';
}

export class AccessTokenClaimsModel implements IAccessTokenClaimsModel {
  private constructor(
    private readonly accessTokenId: string,
    private readonly userId: string,
    private readonly clientId: string,
    private readonly tokenExpireTimestamp: number,
    private readonly scopes: string[],
  ) {}

  getUserId(): string {
    return this.userId;
  }

  getAccessTokenId(): string {
    return this.accessTokenId;
  }

  getClientId(): string {
    return this.clientId;
  }

  getAccessTokenExpireTime(): number {
    return this.tokenExpireTimestamp;
  }

  getScopes(): string[] {
    return this.scopes;
  }

  static fromIdentityServerResponse(
    accessTokenClaims: JwtPayloadModel,
  ): IAccessTokenClaimsModel {
    return new AccessTokenClaimsModel(
      accessTokenClaims[Claims.accessTokenId],
      accessTokenClaims[Claims.userId],
      accessTokenClaims[Claims.clientId],
      accessTokenClaims[Claims.tokenExpireTimestamp],
      accessTokenClaims[Claims.scopes],
    );
  }
}
