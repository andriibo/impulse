import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RefreshTokenModel } from 'infrastructure/modules/oauth2/models/refresh-token.model';
import { RefreshTokenEntity } from 'domain/entities/refresh-token.entity';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { IRefreshTokenRepository } from 'domain/repositories';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenModel)
    private readonly repository: Repository<RefreshTokenModel>,
  ) {}

  async find(id: string): Promise<RefreshTokenEntity> {
    return await this.repository.findOneBy({ id });
  }

  async revokeByAccessTokenIds(
    accessTokenIds: string[],
  ): Promise<UpdateResult> {
    return await this.repository.update(
      { accessTokenId: In(accessTokenIds) },
      { revoked: true },
    );
  }

  async create(refreshToken: RefreshTokenModel): Promise<RefreshTokenEntity> {
    return await this.repository.save(refreshToken);
  }
}
