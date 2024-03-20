import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { UserRequest } from 'presentation/middlewares';
import {AuthGuard} from "presentation/guards/auth.guard";

@Injectable()
export class AuthApplicationGuard extends AuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const parentCanActivate = super.canActivate(context);
    const request: UserRequest = context.switchToHttp().getRequest();

    if (request.user.accessTokenClaims.getUserId()) {
      throw new ForbiddenException(`Bearer token of incorrect grantType.`);
    }

    return parentCanActivate;
  }
}

export const AuthApplication = () => UseGuards(AuthApplicationGuard);
