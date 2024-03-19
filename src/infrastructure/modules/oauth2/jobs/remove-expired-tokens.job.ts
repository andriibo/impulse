import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OAuth2UseCasesFactory } from 'infrastructure/modules/oauth2/factories';

@Injectable()
export class RemoveExpiredTokensJob {
  constructor(private readonly oauth2UseCasesFactory: OAuth2UseCasesFactory) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeExpiredAccessTokens(): Promise<void> {
    const useCase =
      this.oauth2UseCasesFactory.createRemoveExpiredTokensUseCase();
    try {
      await useCase.removeExpiredTokens();
    } catch (error) {
      console.log(error.message);
    }
  }
}
