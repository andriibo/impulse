import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {UserCreatedEvent} from "application/modules/user/events";

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  constructor() {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const { email } = event;

    console.log(`User ${email} has been registered.`);
  }
}
