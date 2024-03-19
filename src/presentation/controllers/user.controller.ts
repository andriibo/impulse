import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes, ApiCreatedResponse,
  ApiMethodNotAllowedResponse,
  ApiOAuth2,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TrimPipe } from 'presentation/pipes';
import {AuthApplication} from 'presentation/guards';
import { ScopeEnum } from 'domain/enums/oauth2';
import {UserUseCasesFactory} from "infrastructure/modules/user/factories";
import {SignUpRequest} from "presentation/views/requests/user";

@Controller('user')
@ApiTags('User')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiMethodNotAllowedResponse({ description: 'Method not allowed' })
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
}
