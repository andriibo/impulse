import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { AccessTokenModel } from 'infrastructure/modules/oauth2/models';
import { IAccessTokenRepository } from 'domain/repositories';
import { AccessTokenEntity } from 'domain/entities';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

@Injectable()
export class AccessTokenRepository implements IAccessTokenRepository {
  constructor(
    @InjectRepository(AccessTokenModel)
    private readonly repository: Repository<AccessTokenModel>,
  ) {}

  async find(id: string): Promise<AccessTokenEntity> {
    return await this.repository.findOneBy({ id });
  }

  async create(accessToken: AccessTokenModel): Promise<AccessTokenEntity> {
    return await this.repository.save(accessToken);
  }

  async findValidTokensByUserId(userId: string): Promise<AccessTokenEntity[]> {
    return await this.repository.findBy({
      userId,
      revoked: false,
      expiresAt: MoreThan(new Date(Date.now())),
    });
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  async revoke(ids: string[]): Promise<UpdateResult> {
    return await this.repository.update({ id: In(ids) }, { revoked: true });
  }

  async getExpiredTokens(): Promise<AccessTokenEntity[]> {
    return await this.repository.find({
      relations: ['refreshToken'],
      where: [
        {
          userId: Not(IsNull()),
          refreshToken: { expiresAt: LessThan(new Date(Date.now())) },
        },
        { userId: IsNull(), expiresAt: LessThan(new Date(Date.now())) },
      ],
    });
  }

  async remove(entities: AccessTokenModel[]): Promise<void> {
    await this.repository.remove(entities, { chunk: 1000 });
  }
}
