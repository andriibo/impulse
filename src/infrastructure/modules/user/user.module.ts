import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
    IUserRepository,
} from 'domain/repositories';
import {ConfigModule} from "@nestjs/config";
import {UserModel} from "infrastructure/modules/user/models";
import {UserRepository} from "infrastructure/modules/user/repositories";
import {SignUpHandler} from "application/modules/user/handlers";
import {UserCreatedHandler} from "application/modules/user/handlers/user-created.handler";
import {IUserService} from "application/modules/user/services";
import {UserService} from "infrastructure/modules/user/services";
import {UserController} from "presentation/controllers";
import {UserUseCasesFactory} from "infrastructure/modules/user/factories";
import {UserSpecification} from "application/modules/user/specifications";
import {GetUserInfoHandler} from "application/modules/user/handlers";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserModel]),
        ConfigModule,
    ],
    exports: [
        IUserRepository, UserSpecification,
    ],
    controllers: [UserController],
    providers: [
        UserUseCasesFactory,
        {
            provide: IUserRepository,
            useClass: UserRepository,
        },
        {
            provide: IUserService,
            useClass: UserService,
        },
        UserSpecification,
        SignUpHandler,
        UserCreatedHandler,
        GetUserInfoHandler,
    ],
})
export class UserModule {
}
