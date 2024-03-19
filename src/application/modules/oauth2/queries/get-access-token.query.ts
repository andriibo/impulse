import { OAuth2HttpRequestDto } from 'src/domain/dto/requests/oauth2';
import { IQuery } from '@nestjs/cqrs';

export class GetAccessTokenQuery implements IQuery {
  constructor(readonly dto: OAuth2HttpRequestDto) {}
}
