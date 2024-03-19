import {Module, OnModuleInit} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
    AccessTokenModel,
    ClientModel,
    RefreshTokenModel,
} from 'infrastructure/modules/oauth2/models';
import {OAuth2Controller} from 'presentation/controllers';
import {
    AccessTokenService,
    ClientService,
    JwtTokenService,
    RefreshTokenService,
    OAuth2HttpResponseService,
} from 'infrastructure/modules/oauth2/services';
import {
    ClientCredentialsStrategy,
    PasswordStrategy,
    RefreshTokenStrategy,
} from 'infrastructure/modules/oauth2/strategies';
import {
    IAccessTokenRepository,
    IClientRepository,
    IRefreshTokenRepository,
    IScopeRepository,
} from 'domain/repositories';
import {
    AccessTokenRepository,
    RefreshTokenRepository,
    ClientRepository,
    ScopeRepository,
} from 'infrastructure/modules/oauth2/repositories';
import {
    GetAccessTokenHandler, RegisterClientHandler, RevokeAccessTokenHandler,
} from 'src/application/modules/oauth2/handlers';
import {
    IJwtTokenService,
    IRefreshTokenService,
    IAccessTokenService,
    IOAuth2HttpResponseService,
    IClientService,
} from 'application/modules/oauth2/services';
import {
    AccessTokenSpecification,
    RefreshTokenSpecification,
} from 'application/modules/oauth2/specifications';
import {OAuth2UseCasesFactory} from 'infrastructure/modules/oauth2/factories';
import {
    OAuth2GrantStrategyRegistry,
    StrategyExplorer,
} from 'application/modules/oauth2/strategies';
import {ConfigModule} from '@nestjs/config';
import {UserModule} from "infrastructure/modules/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ClientModel,
            AccessTokenModel,
            RefreshTokenModel,
        ]),
        UserModule,
        ConfigModule,
    ],
    exports: [OAuth2UseCasesFactory],
    controllers: [OAuth2Controller],
    providers: [
        OAuth2UseCasesFactory,
        RefreshTokenSpecification,
        AccessTokenSpecification,
        StrategyExplorer,
        OAuth2GrantStrategyRegistry,
        ClientCredentialsStrategy,
        RefreshTokenStrategy,
        PasswordStrategy,
        {
            provide: IClientRepository,
            useClass: ClientRepository,
        },
        {
            provide: IAccessTokenRepository,
            useClass: AccessTokenRepository,
        },
        {
            provide: IRefreshTokenRepository,
            useClass: RefreshTokenRepository,
        },
        {
            provide: IScopeRepository,
            useClass: ScopeRepository,
        },
        {
            provide: IJwtTokenService,
            useClass: JwtTokenService,
        },
        {
            provide: IClientService,
            useClass: ClientService,
        },
        {
            provide: IAccessTokenService,
            useClass: AccessTokenService,
        },
        {
            provide: IRefreshTokenService,
            useClass: RefreshTokenService,
        },
        {
            provide: IOAuth2HttpResponseService,
            useClass: OAuth2HttpResponseService,
        },
        GetAccessTokenHandler,
        RevokeAccessTokenHandler,
        RegisterClientHandler,
    ],
})
export class OAuth2Module implements OnModuleInit {
    constructor(
        private readonly explorerService: StrategyExplorer,
        private readonly strategyRegistry: OAuth2GrantStrategyRegistry,
    ) {
    }

    onModuleInit() {
        const {strategies} = this.explorerService.explore();
        this.strategyRegistry.register(strategies);
    }
}
