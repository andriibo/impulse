import { OAuth2HttpRequestDto } from 'domain/dto/requests/oauth2/oauth2-http-request.dto';
import { ClientEntity } from 'domain/entities';
import { OAuth2HttpResponseDto } from 'src/domain/dto/responses/oauth2';
import { Inject } from '@nestjs/common';
import { ScopeEntity } from 'domain/entities/scope.entity';
import { IClientRepository, IScopeRepository } from 'domain/repositories';
import { IOAuth2GrantStrategy } from 'application/modules/oauth2/services';
import { IOAuth2HttpResponseService } from 'application/modules/oauth2/services/oauth2-http-response.service';
import { scopeDelimiterStringConst } from 'domain/const/oauth2';
import {
  OAuth2UnauthorizedError,
} from "application/modules/oauth2/errors/oauth2-unauthorized.error";
import {OAuth2BadRequestError} from "application/modules/oauth2/errors";

export abstract class AbstractStrategy implements IOAuth2GrantStrategy {
  constructor(
    @Inject(IOAuth2HttpResponseService)
    protected readonly oauth2HttpResponseService: IOAuth2HttpResponseService,
    @Inject(IScopeRepository)
    protected readonly scopeRepository: IScopeRepository,
    @Inject(IClientRepository)
    protected readonly clientRepository: IClientRepository,
  ) {}

  async getClientOrFail(id: string): Promise<ClientEntity> {
    const client = await this.clientRepository.find(id);
    if (!client) {
      throw new OAuth2UnauthorizedError(`Client not found.`);
    }

    return client;
  }

  protected async validateClient(
    request: OAuth2HttpRequestDto,
    client: ClientEntity,
  ): Promise<boolean> {
    if (
      client.secret !== request.clientSecret ||
      client.id !== request.clientId ||
      client.deletedAt !== null ||
      !client.grants.includes(request.grantType)
    ) {
      return false;
    }

    return true;
  }

  protected async validateScopes(
    scope?: string | string[],
  ): Promise<ScopeEntity[]> {
    const validatedScopes = [];
    const scopes =
      typeof scope === 'string' ? scope.split(scopeDelimiterStringConst) : scope;

    scopes?.forEach((item) => {
      const scopeEntity = this.scopeRepository.findOrFail(item);
      if (!scopeEntity) {
        throw new OAuth2BadRequestError(`Cannot find the scope "${item}".`);
      }

      validatedScopes.push(scopeEntity);
    });

    return validatedScopes;
  }

  abstract respondToAccessTokenRequest(
    request: OAuth2HttpRequestDto,
  ): Promise<OAuth2HttpResponseDto>;
}
