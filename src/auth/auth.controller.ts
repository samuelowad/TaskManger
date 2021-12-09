import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredDto } from './dto/auth.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body(ValidationPipe) authCredDto: AuthCredDto): Promise<User> {
    // console.log(authCredDto);
    return this.authService.signup(authCredDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredDto: AuthCredDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredDto);
  }
}
