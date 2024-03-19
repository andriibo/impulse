import { RefreshTokenEntity } from 'domain/entities/refresh-token.entity';
import { BaseTokenEntity } from 'domain/entities/base-token.entity';
import {ClientEntity} from "domain/entities/client.entity";
import {UserEntity} from "domain/entities/user.entity";

export interface AccessTokenEntity extends BaseTokenEntity {
  clientId: string;
  userId: string | null;
  scopes: string[];
  client: ClientEntity;
  user: UserEntity | null;
  refreshToken: RefreshTokenEntity | null;
}
