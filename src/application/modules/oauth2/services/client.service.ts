import { ClientEntity } from 'domain/entities';

export interface IClientService {
  create(
    scopes: string[],
    grants?: string[],
    accessTokenLifetime?: number,
    refreshTokenLifetime?: number,
  ): Promise<ClientEntity>;
}

export const IClientService = Symbol('IClientService');
