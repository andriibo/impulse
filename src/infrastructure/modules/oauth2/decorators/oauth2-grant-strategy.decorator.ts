import 'reflect-metadata';
import { OAUTH2_STRATEGY_METADATA } from 'application/modules/oauth2/strategies/strategy.explorer';

export const OAuth2GrantStrategy = (name: string): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(OAUTH2_STRATEGY_METADATA, name, target);
  };
};
