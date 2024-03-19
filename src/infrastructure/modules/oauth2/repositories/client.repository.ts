import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IClientRepository } from 'domain/repositories';
import { ClientEntity } from 'domain/entities';
import { ClientModel } from 'infrastructure/modules/oauth2/models';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientModel)
    private readonly repository: Repository<ClientModel>,
  ) {}

  async find(id: string): Promise<ClientEntity> {
    return await this.repository.findOneBy({ id });
  }

  async create(client: ClientModel): Promise<ClientEntity> {
    return await this.repository.save(client);
  }
}
