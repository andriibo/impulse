import {Column, CreateDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn} from 'typeorm';
import {UserEntity} from 'domain/entities';
import {Exclude} from "class-transformer";

@Entity('user')
export class UserModel implements UserEntity {
  @PrimaryColumn({
    generated: 'uuid',
    nullable: false,
    type: 'uuid',
  })
  id: string;

  @Column({ nullable: false, length: 100, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  @Exclude()
  password: string;

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
}
