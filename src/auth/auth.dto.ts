import { IsString } from 'class-validator';

export class UserSiginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
