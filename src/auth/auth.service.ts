import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredDto } from './dto/auth.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.respository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(authCredDto: AuthCredDto): Promise<User> {
    return this.userRepository.signUp(authCredDto);
  }

  async signIn(authCredDto: AuthCredDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid password or username');
    }
    // console.log(result);
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
