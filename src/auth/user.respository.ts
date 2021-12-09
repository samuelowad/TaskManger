import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredDto } from './dto/auth.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredDto: AuthCredDto): Promise<User> {
    // console.log(authCredDto);
    const salt = await bcrypt.genSalt();

    const { username, password } = authCredDto;
    const user = new User();
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();

      return user;
    } catch (error) {
      // console.log(error);
      // check if its dulicate
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredDto: AuthCredDto): Promise<string> {
    const { username, password } = authCredDto;
    const user = await this.findOne({ username: username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
