import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { FilterPagination } from '../core/interface/filter.interface';

export class createPostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class updatePostDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;
}

export class getPostsDto implements FilterPagination {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

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
