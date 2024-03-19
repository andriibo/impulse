export class OAuth2HttpResponseDto {
  tokenType: string = 'Bearer';

  constructor(
    readonly accessToken: string,
    readonly expiresIn: number,
    readonly refreshToken?: string,
  ) {}
}
