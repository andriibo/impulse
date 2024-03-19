import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty, IsUUID,
  Length,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { OAuth2HttpRequestDto } from 'src/domain/dto/requests/oauth2';
import { GrantTypeEnum } from 'domain/enums/oauth2';

export class OAuth2HttpRequest extends OAuth2HttpRequestDto {
  @ApiProperty({
    enum: GrantTypeEnum,
    description: 'The type of grant you are requesting',
  })
  @IsNotEmpty()
  @IsIn(Object.values(GrantTypeEnum))
  grantType: GrantTypeEnum;

  @ApiProperty({
    description: 'The API Key given by the application',
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsUUID()
  @MaxLength(500)
  clientId: string;

  @ApiProperty({
    description: 'The API Token given by the application',
    maxLength: 500,
  })
  @IsNotEmpty()
  @MaxLength(500)
  clientSecret: string;

  @ValidateIf((object) => object.grantType === GrantTypeEnum.RefreshToken)
  @ApiProperty({
    required: false,
    description:
      'The refresh token only when grant_type is set to "refresh_token"',
  })
  refreshToken?: string;

  @ValidateIf((object) => object.grantType === GrantTypeEnum.Password)
  @ApiProperty({
    required: false,
    maxLength: 100,
    description: 'The username only when grant_type is set to "password"',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEmail()
  @MaxLength(100)
  username?: string;

  @ValidateIf((object) => object.grantType === GrantTypeEnum.Password)
  @ApiProperty({
    required: false,
    minLength: 8,
    maxLength: 16,
    description: 'The password when grant_type is set to "password"',
  })
  @Length(8, 16)
  password?: string;
}
