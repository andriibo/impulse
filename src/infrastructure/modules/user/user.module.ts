import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  IUserRepository,
} from 'domain/repositories';
import {ConfigModule} from "@nestjs/config";
import {UserModel} from "infrastructure/modules/user/models";
import {UserRepository} from "infrastructure/modules/user/repositories";

@Module({
  imports: [
      TypeOrmModule.forFeature([UserModel]),
      ConfigModule,
  ],
  exports: [
    IUserRepository,
  ],
  controllers: [],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
