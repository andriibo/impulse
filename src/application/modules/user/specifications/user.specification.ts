import * as bcrypt from 'bcryptjs';
import {UserNotFoundError} from "application/modules/user/errors/user-not-found.error";

export class UserSpecification {
  async assertPasswordsAreSame(
    password: string,
    passwordHash: string,
  ): Promise<void> {
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      throw new UserNotFoundError('Username or password is incorrect.');
    }
  }
}
