import { IsString, MinLength } from 'class-validator';

export class createUserDto {
  @IsString()
  @MinLength(4)
  fullname: string;

  @IsString()
  @MinLength(8)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class updateUserDto {
  @IsString()
  @MinLength(4)
  fullname: string;
}

export class deleteRepsonse {
  code: string;
  message: string;
}
