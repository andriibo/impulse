import { BaseTokenEntity, ClientEntity } from 'domain/entities';
import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { IClientRepository } from 'domain/repositories';
import { ScopeEntity } from 'domain/entities/scope.entity';
import { JwtPayloadModel } from 'infrastructure/modules/oauth2/models/jwt-payload.model';
import { IJwtTokenService } from 'application/modules/oauth2/services';

@Injectable()
export class JwtTokenService implements IJwtTokenService {
  constructor(
    @Inject(IClientRepository)
    protected readonly clientRepository: IClientRepository,
    private readonly jwtService: JwtService,
  ) {}

  async generate(
    accessToken: BaseTokenEntity,
    client: ClientEntity,
    scopes: ScopeEntity[],
    userId?: string,
  ): Promise<string> {
    const payload: JwtPayloadModel = {
      sub: userId ?? '',
      aud: client.id,
      exp: accessToken.expiresAt.getTime() / 1000,
      nbf: accessToken.createdAt.getTime() / 1000 - 100,
      iat: accessToken.createdAt.getTime() / 1000,
      jti: accessToken.id,
      scopes: scopes.map((item) => item.id),
    };

    return await this.jwtService.signAsync(payload, {
      privateKey: client.privateKey,
    });
  }

  async decode(token: string): Promise<JwtPayloadModel> {
    return await this.jwtService.decode(token);
  }

  async verify(
    token: string,
    publicKey: string,
  ): Promise<JwtPayloadModel> {
    return await this.jwtService.verifyAsync(token, {
      publicKey,
    });
  }
}
