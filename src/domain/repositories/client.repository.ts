import { ClientEntity } from 'domain/entities';

export interface IClientRepository {
  find(id: string): Promise<ClientEntity>;

  create(client: ClientEntity): Promise<ClientEntity>;
}

export const IClientRepository = Symbol('IClientRepository');
