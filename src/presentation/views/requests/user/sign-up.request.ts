import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import {SignUpRequestDto} from "domain/dto/requests/user";

export class SignUpRequest extends SignUpRequestDto {
  @ApiProperty({ maxLength: 100, example: 'test@gmail.com' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 16,
  })
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space.',
  })
  @Length(8, 16)
  password: string;
}
