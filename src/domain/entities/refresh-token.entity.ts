import { AccessTokenEntity } from 'domain/entities/access-token.entity';
import { BaseTokenEntity } from 'domain/entities/base-token.entity';

export interface RefreshTokenEntity extends BaseTokenEntity {
  accessTokenId: string;
  accessToken: AccessTokenEntity;
}
