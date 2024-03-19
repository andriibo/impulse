import { IOAuth2GrantStrategy } from 'application/modules/oauth2/services/oauth2-grant.strategy';
import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { OAUTH2_STRATEGY_METADATA } from 'application/modules/oauth2/strategies/strategy.explorer';
import { OAuth2HttpRequestDto } from 'domain/dto/requests/oauth2/oauth2-http-request.dto';
import { OAuth2HttpResponseDto } from 'domain/dto/responses/oauth2';
import {OAuth2BadRequestError} from "application/modules/oauth2/errors";

export type OAuth2GrantStrategyType = Type<IOAuth2GrantStrategy>;

/**
 * This is the main class used to execute strategies
 */
@Injectable()
export class OAuth2GrantStrategyRegistry {
  /**
   * Store all available granted strategies
   */
  private registry: { [s: string]: IOAuth2GrantStrategy } = {};

  constructor(private readonly moduleRef: ModuleRef) {}

  /**
   * Register all strategies with the decorators
   *
   * @param strategies
   */
  register(strategies: OAuth2GrantStrategyType[] = []) {
    strategies.forEach((strategy) => this.registerStrategy(strategy));
  }

  async respondToAccessTokenRequest(
    request: OAuth2HttpRequestDto,
  ): Promise<OAuth2HttpResponseDto> {
    if (!(request.grantType in this.registry)) {
      throw new OAuth2BadRequestError(`Cannot find the a strategy for the grant type "${request.grantType}"`);
    }

    return await this.registry[request.grantType].respondToAccessTokenRequest(
      request,
    );
  }

  /**
   * Register a single strategies
   *
   * @param strategy
   */
  private registerStrategy(strategy: OAuth2GrantStrategyType): void {
    const instance = this.moduleRef.get(strategy, { strict: false });
    if (!instance) {
      return;
    }

    const strategyName = this.reflectStrategyName(strategy);
    this.registry[strategyName] = instance as IOAuth2GrantStrategy;
  }

  private reflectStrategyName(strategy: OAuth2GrantStrategyType): string {
    return Reflect.getMetadata(OAUTH2_STRATEGY_METADATA, strategy);
  }
}
