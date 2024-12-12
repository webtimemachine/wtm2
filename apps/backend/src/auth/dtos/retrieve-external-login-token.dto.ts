import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RetrieveExternalLoginTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  externalClientId: string;

  @ApiProperty()
  @IsNotEmpty()
  deviceKey: string;

  @ApiProperty()
  @IsNotEmpty()
  userAgent: string;

  @ApiProperty()
  @IsNotEmpty()
  userAgentData: string;
}
