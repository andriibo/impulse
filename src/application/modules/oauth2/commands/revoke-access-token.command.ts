import { ICommand } from '@nestjs/cqrs';

export class RevokeAccessTokenCommand implements ICommand {
  constructor(readonly id: string) {}
}
