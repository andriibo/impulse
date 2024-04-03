import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {dbConnectionOptions} from "config/db.config";
import {CqrsModule} from "@nestjs/cqrs";
import {RequestContextModule} from 'nestjs-request-context';
import {CoreModule} from "infrastructure/modules/core.module";
import {OAuth2Module} from "infrastructure/modules/oauth2/oauth2.module";
import {ConsoleModule} from "infrastructure/modules/console/console.module";
import {AssignUserMiddleware} from "presentation/middlewares";
import {RequestUserService} from "infrastructure/services";
import {UserModule} from "infrastructure/modules/user/user.module";
import {APP_FILTER, APP_GUARD} from "@nestjs/core";
import {ThrottlerBehindProxyGuard} from "presentation/guards";
import {ThrottlerModule} from "@nestjs/throttler";
import {ErrorsFilter} from "src/presentation/filters";

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 1000,
                limit: 10,
            },
        ]),
        TypeOrmModule.forRoot({...dbConnectionOptions, autoLoadEntities: true}),
        CqrsModule.forRoot(),
        RequestContextModule,
        CoreModule,
        OAuth2Module,
        ConsoleModule,
        UserModule,
    ],
    providers: [
        RequestUserService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerBehindProxyGuard,
        },
        {
            provide: APP_FILTER,
            useClass: ErrorsFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AssignUserMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
