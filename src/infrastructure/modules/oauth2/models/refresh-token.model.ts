import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessTokenModel } from 'infrastructure/modules/oauth2/models/access-token.model';
import { RefreshTokenEntity } from 'domain/entities/refresh-token.entity';

@Entity('refresh_token')
export class RefreshTokenModel implements RefreshTokenEntity {
  @PrimaryColumn({
    generated: 'uuid',
    nullable: false,
    type: 'uuid',
  })
  id: string;

  @Column('uuid', { name: 'access_token_id', unique: true, nullable: false })
  accessTokenId: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  revoked: boolean;

  @Column('timestamp', { name: 'expires_at', nullable: false })
  expiresAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    nullable: false,
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    nullable: false,
    default: () => 'now()',
  })
  updatedAt: Date;

  @OneToOne(() => AccessTokenModel, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'access_token_id', referencedColumnName: 'id' })
  accessToken: AccessTokenModel;
}
