import { GrantTypeEnum } from 'domain/enums/oauth2';

export class OAuth2HttpRequestDto {
  grantType: GrantTypeEnum;
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  username?: string;
  password?: string;
}
