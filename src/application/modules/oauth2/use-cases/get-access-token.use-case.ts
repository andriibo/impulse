import { OAuth2HttpRequestDto } from 'domain/dto/requests/oauth2/oauth2-http-request.dto';
import { OAuth2HttpResponseDto } from 'src/domain/dto/responses/oauth2';
import { IQueryBus } from '@nestjs/cqrs/dist/interfaces';
import {GetAccessTokenQuery} from "application/modules/oauth2/queries";

export class GetAccessTokenUseCase {
  constructor(private readonly queryBus: IQueryBus) {}

  async get(request: OAuth2HttpRequestDto): Promise<OAuth2HttpResponseDto> {
    return await this.queryBus.execute(new GetAccessTokenQuery(request));
  }
}
