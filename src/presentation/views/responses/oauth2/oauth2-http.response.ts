import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OAuth2HttpResponseDto } from 'src/domain/dto/responses/oauth2';

export class OAuth2HttpResponse extends OAuth2HttpResponseDto {
  @ApiProperty({
    description:
      'A valid access token that Identity Server issued to the user who you want to authenticate.',
  })
  accessToken: string;

  @ApiProperty({
    description:
      'The expiration period of the authentication result in seconds.',
    example: 3599,
  })
  expiresIn: number;

  @ApiPropertyOptional({
    description: 'The refresh_token only when auth is password grant',
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'The type of token, in our case should always be "Bearer"',
    example: 'Bearer',
  })
  tokenType: string = 'Bearer';
}
