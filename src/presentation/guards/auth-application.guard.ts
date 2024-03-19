import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { isNullOrUndefined } from 'infrastructure/support/type.helper';
import { UserRequest } from 'presentation/middlewares';

@Injectable()
export class AuthApplicationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: UserRequest = context.switchToHttp().getRequest();

    if (
      isNullOrUndefined(request.user) ||
      isNullOrUndefined(request.user.accessTokenClaims)
    ) {
      throw new UnauthorizedException();
    }

    if (request.user.accessTokenClaims.getUserId()) {
      throw new ForbiddenException(`Bearer token of incorrect grantType.`);
    }

    return true;
  }
}

export const AuthApplication = () => UseGuards(AuthApplicationGuard);
