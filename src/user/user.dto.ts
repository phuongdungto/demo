import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../core/enum';
import { FilterPagination } from '../core/interface/filter.interface';

export class createUserDto {
  @IsString()
  @MinLength(4)
  fullname: string;

  @IsString()
  @MinLength(8)
  @IsEmail()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  image: string;
}

export class updateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  fullname: string;

  @IsEnum(Role, { each: true })
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  image: string;
}

export class deleteRepsonse {
  code: string;
  message: string;
}

export class getusersDto implements FilterPagination {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  fullname: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  @IsOptional()
  role: string[];

  @IsNumberString()
  @IsOptional()
  page: number;

  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  sort: string;

  @IsEnum(['desc', 'asc'])
  @IsOptional()
  sortBy: string;

  constructor() {
    this.page = 1;
    this.limit = 5;
  }
}
