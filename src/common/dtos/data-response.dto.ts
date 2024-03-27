import { Type as type } from '@nestjs/common';
import { Exclude, Expose, Type, TypeHelpOptions } from 'class-transformer';
import { MessageResponse } from './message-response.dto';

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
