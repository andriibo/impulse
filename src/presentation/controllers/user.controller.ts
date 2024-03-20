import {
  Body, ClassSerializerInterceptor,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post, Req, UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes, ApiCreatedResponse,
  ApiMethodNotAllowedResponse, ApiNotFoundResponse,
  ApiOAuth2, ApiOkResponse,
  ApiTags, ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse, ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { TrimPipe } from 'presentation/pipes';
import {AuthApplication, AuthUser} from 'presentation/guards';
import { ScopeEnum } from 'domain/enums/oauth2';
import {UserUseCasesFactory} from "infrastructure/modules/user/factories";
import {SignUpRequest} from "presentation/views/requests/user";
import {UserRequest} from "presentation/middlewares";
import {UserResponseDto} from "domain/dto/responses/user/user-response.dto";
import {UserResponse} from "presentation/views/responses/user";

@Controller('user')
@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiMethodNotAllowedResponse({ description: 'Method not allowed' })
@ApiTooManyRequestsResponse({ description: 'Too Many Requests' })
@ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
export class UserController {
  constructor(private readonly userUseCasesFactory: UserUseCasesFactory) {}

  @AuthApplication()
  @ApiOAuth2([ScopeEnum.Application])
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Created' })
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  async signUp(
    @Body(TrimPipe) request: SignUpRequest,
  ): Promise<void> {
    const useCase = this.userUseCasesFactory.createSignUpUseCase();

    await useCase.signUp(request);
  }

  @AuthUser()
  @ApiOAuth2([ScopeEnum.User])
  @Get('information')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserResponse })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
  async getUserInfo(@Req() request: UserRequest): Promise<UserResponseDto> {
    const useCase = this.userUseCasesFactory.createGetUserInfoUseCase();

    return await useCase.get(request.user.accessTokenClaims.getUserId());
  }
}
