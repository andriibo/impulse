import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {SignUpCommand} from "application/modules/user/commands";
import {Inject} from "@nestjs/common";
import {IUserService} from "application/modules/user/services";
import {UserCreatedEvent} from "application/modules/user/events";

@CommandHandler(SignUpCommand)
export class SignUpHandler
  implements ICommandHandler<SignUpCommand>
{
  constructor(
      private readonly eventBus: EventBus,
      @Inject(IUserService)
      private readonly userService: IUserService,
  ) {}

  async execute(command: SignUpCommand): Promise<void> {
    const { email, password } = command;

    const user = await this.userService.create(email, password);


    this.eventBus.publish(
        new UserCreatedEvent(user.email),
    );
  }
}
