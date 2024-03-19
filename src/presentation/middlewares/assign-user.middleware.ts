import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestUserService } from 'infrastructure/services/request-user.service';
import { IRequestUserModel } from 'application/modules/oauth2/models';

@Injectable()
export class AssignUserMiddleware implements NestMiddleware {
  constructor(private readonly requestUserService: RequestUserService) {}

  async use(
    request: UserRequest,
    response: Response,
    next: (error?: Error | any) => void,
  ): Promise<any> {
    request.user = await this.requestUserService.getUserDataByHttpHeaders(
      request.headers,
    );
    next();
  }
}

export interface UserRequest extends Request {
  user: Nullable<IRequestUserModel>;
}

type Nullable<T> = T | null;
