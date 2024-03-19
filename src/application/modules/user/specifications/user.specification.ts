import {
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export class UserSpecification {
  async assertPasswordsAreSame(
    password: string,
    passwordHash: string,
    errorMessage: string = '',
  ): Promise<void> {
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      throw new BadRequestException(errorMessage);
    }
  }
}
