import { ICommand } from '@nestjs/cqrs';

export class SignUpCommand implements ICommand {
  constructor(readonly email: string, readonly password: string) {}
}
