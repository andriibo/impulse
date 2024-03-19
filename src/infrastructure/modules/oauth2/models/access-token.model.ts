import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessTokenEntity } from 'domain/entities';
import { RefreshTokenModel } from 'infrastructure/modules/oauth2/models';
import { ClientModel } from 'infrastructure/modules/oauth2/models';
import {UserModel} from "infrastructure/modules/user/models";

@Entity('access_token')
export class AccessTokenModel implements AccessTokenEntity {
  @PrimaryColumn({
    generated: 'uuid',
    nullable: false,
    type: 'uuid',
  })
  id: string;

  @Column('uuid', { name: 'client_id', nullable: false })
  clientId: string;

  @Column('uuid', { name: 'user_id', nullable: true })
  userId: string | null;

  @Column({ name: 'scopes', type: 'simple-array', nullable: true })
  scopes: string[];

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

  @ManyToOne(() => ClientModel, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  client: ClientModel;

  @ManyToOne(() => UserModel, {
    nullable: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserModel | null;

  @OneToOne(() => RefreshTokenModel, (refreshToken) => refreshToken.accessToken)
  refreshToken: RefreshTokenModel | null;
}
