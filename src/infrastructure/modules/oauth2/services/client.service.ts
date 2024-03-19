import { ClientEntity } from 'domain/entities';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientModel } from 'infrastructure/modules/oauth2/models';
import { IClientRepository } from 'domain/repositories';
import { IClientService } from 'application/modules/oauth2/services/client.service';
import * as crypto from 'crypto';
import * as selfsigned from 'selfsigned';
import { ConfigService } from '@nestjs/config';
import { GrantTypeEnum, ScopeEnum } from 'domain/enums/oauth2';

@Injectable()
export class ClientService implements IClientService {
  constructor(
    @Inject(IClientRepository)
    protected readonly clientRepository: IClientRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(
    scopes: string[],
    grants?: string[],
    accessTokenLifetime?: number,
    refreshTokenLifetime?: number,
  ): Promise<ClientEntity> {
    const client = new ClientModel();
    client.secret = crypto.randomBytes(32).toString('hex');
    client.scopes = scopes.filter((scope) => {
      if (!Object.values(ScopeEnum).includes(scope as ScopeEnum)) {
        throw new BadRequestException(`Not allowed scope ${scope}.`);
      }
      return scope;
    });
    client.accessTokenLifetime = accessTokenLifetime || 3600;
    client.refreshTokenLifetime = refreshTokenLifetime || 7200;
    const filteredGrants = grants?.filter((grant) => {
      if (grant in GrantTypeEnum) {
        return grant;
      }

      throw new BadRequestException(`Not allowed grant ${grant}.`);
    });
    client.grants = filteredGrants || Object.values(GrantTypeEnum);

    const url = new URL(this.configService.get<string>('APP_URL'));
    // generate keys
    const attrs = [{ name: 'commonName', value: url.hostname }];
    const pem = selfsigned.generate(attrs, {
      days: 365,
      keySize: 2048,
      notBeforeDate: new Date(Date.now()),
      algorithm: 'RS256',
    });

    client.privateKey = pem.private;
    client.publicKey = pem.public;
    client.cert = pem.cert;

    const exp = new Date();
    exp.setDate(exp.getDate() + 365);
    client.certExpiresAt = exp;

    return await this.clientRepository.create(client);
  }
}
