import { JwtPayload } from 'jsonwebtoken';

export class JwtPayloadModel implements JwtPayload {
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  scopes: string[];
}
