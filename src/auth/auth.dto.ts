import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UserSiginDto {
  @IsString()
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}

export class UserSigupDto {
  @IsString()
  @MinLength(5)
  fullname: string;

  @IsString()
  @MinLength(8)
  @IsEmail()
  username: string;

  @IsString()
  @MinLength(8)
  @IsString()
  password: string;
}

export class UserForgotPWDto {
  @IsString()
  @MinLength(8)
  @IsEmail()
  @IsNotEmpty()
  username: string;
}

export class resetPasswordDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  token: string;
}
