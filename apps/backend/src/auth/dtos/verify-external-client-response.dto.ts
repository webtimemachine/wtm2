import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class VerifyExternalClientPayloadResponseDto {
  @Expose()
  @ApiProperty()
  externalClientName: string;

  @Expose()
  @ApiProperty()
  deviceKey: string;

  @Expose()
  @ApiProperty()
  userAgent: string;

  @Expose()
  @ApiProperty()
  userAgentData: string;
}

@Exclude()
export class VerifyExternalClientResponseDto {
  @Expose()
  @ApiProperty({ type: () => VerifyExternalClientPayloadResponseDto })
  payload: VerifyExternalClientPayloadResponseDto;
}
