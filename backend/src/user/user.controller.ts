import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UsernameParamDto } from './dto/username-param.dto';
import { UserProfile } from './user.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  getUser(@Param() params: UsernameParamDto): Promise<UserProfile> {
    return this.userService.getProfile(params.username);
  }
}
