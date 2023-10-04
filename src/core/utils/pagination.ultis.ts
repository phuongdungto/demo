import { In, Like } from 'typeorm';
import dataSource from '../../database/data-source';
import { FilterPagination } from '../interface/filter.interface';

export function Pagination(
  entity: any,
  { limit, page, sort, sortBy, ...filter }: FilterPagination,
) {
  const skip = (page - 1) * limit;
  const take = limit;
  const where = {};
  const order = {};
  const enumcolumns = dataSource
    .getMetadata(entity)
    .ownColumns.filter((column) => column.type === 'enum');
  const enumProperties = enumcolumns.map((column) => column.propertyName);
  console.log(enumProperties);
  Object.keys(filter).forEach((key) => {
    const value = filter[key];
    if (value === '') {
      return;
    }
    if (typeof value === 'string' && !enumProperties.includes(key)) {
      where[key] = Like(`%${value}%`);
      return;
    }
    if (enumProperties.includes(key)) {
      where[key] = In(value);
      return;
    }
    where[key] = value;
  });
  if (sort != undefined) {
    order[sort] = sortBy;
  }
  return {
    skip,
    take,
    where,
    order,
  };
}
