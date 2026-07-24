import { IsString, Matches, MaxLength } from 'class-validator';

// GitHub usernames: up to 39 chars, alphanumeric with non-consecutive hyphens
export class UsernameParamDto {
  @IsString()
  @MaxLength(39)
  @Matches(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, {
    message: 'username must be a valid GitHub username',
  })
  username!: string;
}
