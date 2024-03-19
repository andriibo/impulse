import { ConsoleLogger, Module } from '@nestjs/common';
import { IConsoleService } from 'application/modules/console/services';
import { ConsoleService } from 'infrastructure/modules/console/services';
import { ScheduleModule } from '@nestjs/schedule';
import { ConsoleModule as ConsoleNestJSModule } from 'nestjs-console';
import { OAuth2Module } from 'infrastructure/modules/oauth2/oauth2.module';

@Module({
  imports: [ConsoleNestJSModule, ScheduleModule.forRoot(), OAuth2Module],
  exports: [IConsoleService],
  providers: [
    {
      provide: IConsoleService,
      useClass: ConsoleService,
    },
    ConsoleLogger,
  ],
})
export class ConsoleModule {}
