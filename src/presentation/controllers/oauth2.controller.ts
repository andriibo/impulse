import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpStatus,
  HttpCode, Req,
} from '@nestjs/common';
import { OAuth2HttpResponse } from 'src/presentation/views/responses/oauth2';
import { OAuth2UseCasesFactory } from 'infrastructure/modules/oauth2/factories';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiMethodNotAllowedResponse, ApiNoContentResponse, ApiOAuth2,
  ApiOkResponse,
  ApiTags, ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {OAuth2HttpRequest} from "presentation/views/requests/oauth2";
import {OAuth2HttpResponseDto} from "domain/dto/responses/oauth2";
import {ScopeEnum} from "domain/enums/oauth2";
import {UserRequest} from "presentation/middlewares";
import {Auth} from "presentation/guards";
import {RevokeTokenRequestDto} from "domain/dto/requests/oauth2";
import {Throttle} from "@nestjs/throttler";

@Controller('oauth/2.0')
@ApiTags('OAuth')
@ApiConsumes('application/json')
@UseInterceptors(ClassSerializerInterceptor)
@ApiMethodNotAllowedResponse({ description: 'Method not allowed' })
@ApiTooManyRequestsResponse({ description: 'Too Many Requests' })
export class OAuth2Controller {
  constructor(private readonly oauth2UseCasesFactory: OAuth2UseCasesFactory) {}

  @Throttle({ default: { limit: 10, ttl: 5000 } })
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: OAuth2HttpResponse })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  async getToken(
    @Body() requestBody: OAuth2HttpRequest,
  ): Promise<OAuth2HttpResponseDto> {
    const useCase = this.oauth2UseCasesFactory.createGetAccessTokenUseCase();

    return await useCase.get(requestBody);
  }

  @Auth()
  @Post('revoke-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOAuth2(Object.values(ScopeEnum))
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNoContentResponse({ description: 'No content' })
  async revokeToken(@Req() request: UserRequest): Promise<void> {
    const useCase = this.oauth2UseCasesFactory.createRevokeTokenUseCase();

    await useCase.revoke(
        new RevokeTokenRequestDto(
            request.user.accessTokenClaims.getAccessTokenId(),
        ),
    );
  }
}
