import { Type as type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type, TypeHelpOptions } from 'class-transformer';

@Exclude()
export class MessageResponse {
  @Expose()
  @ApiProperty()
  statusCode?: number;

  @Expose()
  @ApiProperty()
  message?: string;
}

@Exclude()
export class DataResponse<T> extends MessageResponse {
  @Expose()
  @Type((type: TypeHelpOptions) => {
    return (type.newObject as DataResponse<T>).type;
  })
  data: T;

  @Exclude()
  private type: type;

  constructor(type: type) {
    super();
    this.type = type;
  }
}

@Exclude()
class MetaResponse<T> extends DataResponse<T> {
  @Expose()
  meta: object;
}

@Exclude()
export class PaginationMeta {
  @Expose()
  @ApiProperty()
  offset: number;

  @Expose()
  @ApiProperty()
  limit: number;

  @Expose()
  @ApiProperty()
  count: number;
}

@Exclude()
export class Pagination {
  @Expose()
  @Type(() => PaginationMeta)
  @ApiProperty()
  pagination: PaginationMeta;
}

@Exclude()
export class PaginationResponse<T> extends MetaResponse<T> {
  @Expose()
  @Type(() => Pagination)
  meta: Pagination;
}

@Exclude()
export class UpdatedDataMeta {
  @Expose()
  @ApiProperty()
  failure: number;
  @Expose()
  @ApiProperty()
  success: number;
  @Expose()
  @ApiProperty()
  total: number;
}

@Exclude()
export class UpdatedDataResponse<T> extends MetaResponse<T> {
  @Expose()
  @ApiProperty({ type: UpdatedDataMeta })
  @Type(() => UpdatedDataMeta)
  meta: UpdatedDataMeta;
}
