import {BadRequestException, Inject} from '@nestjs/common';
import { OAuth2GrantStrategy } from 'infrastructure/modules/oauth2/decorators';
import { IClientRepository, IScopeRepository } from 'domain/repositories';
import { OAuth2HttpRequestDto } from 'domain/dto/requests/oauth2/oauth2-http-request.dto';
import { AbstractStrategy } from 'infrastructure/modules/oauth2/strategies/abstract.strategy';
import { OAuth2HttpResponseDto } from 'src/domain/dto/responses/oauth2';
import { UserEntity } from 'domain/entities';
import { IUserRepository } from 'domain/repositories/user.repository';
import { IOAuth2HttpResponseService } from 'application/modules/oauth2/services/oauth2-http-response.service';
import {UserSpecification} from "application/modules/user/specifications";

@OAuth2GrantStrategy('password')
export class PasswordStrategy extends AbstractStrategy {
  constructor(
    @Inject(IOAuth2HttpResponseService)
    protected readonly oauth2HttpResponseService: IOAuth2HttpResponseService,
    @Inject(IScopeRepository)
    protected readonly scopeRepository: IScopeRepository,
    @Inject(IClientRepository)
    protected readonly clientRepository: IClientRepository,
    @Inject(IUserRepository)
    protected readonly userRepository: IUserRepository,
    protected readonly userSpecification: UserSpecification,
  ) {
    super(oauth2HttpResponseService, scopeRepository, clientRepository);
  }

  private async validateUser(
    request: OAuth2HttpRequestDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(request.username);
    if (!user) {
      throw new BadRequestException(`Username or password is incorrect.`);
    }

    await this.userSpecification.assertPasswordsAreSame(
        request.password,
        user.password,
        'Username or password is incorrect.',
    );

    return user;
  }

  async respondToAccessTokenRequest(
    request: OAuth2HttpRequestDto,
  ): Promise<OAuth2HttpResponseDto> {
    const client = await this.getClientOrFail(request.clientId);
    await this.validateClient(request, client);
    const user = await this.validateUser(request);
    const finalizedScopes = this.scopeRepository.finalizeScopes(
      request.grantType,
    );

    return await this.oauth2HttpResponseService.generateHttpResponse(
      client,
      finalizedScopes,
      user.id,
    );
  }
}
