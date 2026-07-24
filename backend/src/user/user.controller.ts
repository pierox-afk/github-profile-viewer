import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UsernameParamDto } from './dto/username-param.dto';
import {
  ContributionCalendar,
  RepoSummary,
  UserProfile,
  UserSuggestion,
} from './user.types';

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

  @Get(':username/repos')
  getRepos(@Param() params: UsernameParamDto): Promise<RepoSummary[]> {
    return this.userService.getRepos(params.username);
  }

  @Get(':username/starred')
  getStarred(@Param() params: UsernameParamDto): Promise<RepoSummary[]> {
    return this.userService.getStarred(params.username);
  }

  @Get(':username/contributions')
  getContributions(
    @Param() params: UsernameParamDto,
  ): Promise<ContributionCalendar> {
    return this.userService.getContributions(params.username);
  }
}
