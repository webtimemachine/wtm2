import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { SimpleNavigationEntryDto } from '../../navigation/dtos/simple-navigation-entry.dto';

@Exclude()
export class QueryResultDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  query: string;

  @ApiProperty({ type: () => SimpleNavigationEntryDto, isArray: true })
  @Expose()
  results: SimpleNavigationEntryDto[];
}
