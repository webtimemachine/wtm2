import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RetrieveExternalLoginTokenResponseDto {
  @Expose()
  @ApiProperty()
  externalClientToken: string;
}
