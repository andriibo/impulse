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

@Module({
    imports: [
        TypeOrmModule.forRoot({...dbConnectionOptions, autoLoadEntities: true}),
        CqrsModule.forRoot(),
        RequestContextModule,
        CoreModule,
        OAuth2Module,
        ConsoleModule,
    ],
    providers: [
        RequestUserService,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AssignUserMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
