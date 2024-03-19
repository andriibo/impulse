export interface IAccessTokenClaimsModel {
  getAccessTokenId(): string;
  getUserId(): string;
  getClientId(): string;
  getAccessTokenExpireTime(): number;
  getScopes(): string[];
}
