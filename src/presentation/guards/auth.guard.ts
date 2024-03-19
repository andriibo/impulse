import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { isNullOrUndefined } from 'infrastructure/support/type.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (
      isNullOrUndefined(request.user) ||
      isNullOrUndefined(request.user.accessTokenClaims)
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

export const Auth = () => UseGuards(AuthGuard);
