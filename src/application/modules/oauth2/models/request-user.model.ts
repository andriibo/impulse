import { IAccessTokenClaimsModel } from 'application/modules/oauth2/models/access-token-claims.model';

export interface IRequestUserModel {
  accessToken: string;
  accessTokenClaims: IAccessTokenClaimsModel;
}
