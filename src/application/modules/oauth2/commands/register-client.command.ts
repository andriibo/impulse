import { ICommand } from '@nestjs/cqrs';

export class RegisterClientCommand implements ICommand {
  constructor(
    readonly scopes: string[],
    readonly grants?: string[],
    readonly accessTokenLifetime?: number,
    readonly refreshTokenLifetime?: number,
  ) {}
}
