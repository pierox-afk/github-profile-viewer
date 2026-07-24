import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UsernameParamDto } from './dto/username-param.dto';
import { UserProfile, UserSuggestion } from './user.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  searchUsers(@Query('q') q?: string): Promise<UserSuggestion[]> {
    return this.userService.searchUsers(q ?? '');
  }

  @Get(':username')
  getUser(@Param() params: UsernameParamDto): Promise<UserProfile> {
    return this.userService.getProfile(params.username);
  }
}
