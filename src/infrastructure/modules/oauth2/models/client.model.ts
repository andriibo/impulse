import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { ClientEntity } from 'domain/entities';
import { GrantTypeEnum } from 'domain/enums/oauth2';

@Entity('client')
@Unique(['secret'])
export class ClientModel implements ClientEntity {
  @PrimaryColumn({
    generated: 'uuid',
    nullable: false,
    type: 'uuid',
  })
  id: string;

  @Column({ nullable: false, length: 500 })
  secret: string;

  @Column({
    name: 'grants',
    type: 'simple-array',
    nullable: false,
    default: `${GrantTypeEnum.ClientCredentials},${GrantTypeEnum.RefreshToken}`,
  })
  grants: string[];

  /**
   * Client scopes. The scopes should contain the list of third party applications
   * the client has access to
   */
  @Column({
    name: 'scopes',
    type: 'simple-array',
    nullable: false,
  })
  scopes: string[];

  @Column({ name: 'access_token_lifetime', nullable: false, default: 3600 })
  accessTokenLifetime: number;

  @Column({ name: 'refresh_token_lifetime', nullable: false, default: 7200 })
  refreshTokenLifetime: number;

  @Column({ type: 'text', name: 'private_key', nullable: false })
  privateKey: string;

  @Column({ type: 'text', name: 'public_key', nullable: false })
  publicKey: string;

  @Column({ type: 'text', nullable: false })
  cert: string;

  @Column({ type: 'timestamp', name: 'cert_expires_at', nullable: false })
  certExpiresAt: Date;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
    default: () => 'now()',
  })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
