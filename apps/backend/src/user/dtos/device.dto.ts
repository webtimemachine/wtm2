import { Expose, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UAResult } from './uaresult.dto';

@Exclude()
export class DeviceDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  deviceKey: string;

  @ApiProperty({
    required: false,
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  })
  @Expose()
  userAgent?: string;

  @ApiProperty({
    required: false,
    type: () => UAResult,
    example: {
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      browser: {
        name: 'Chrome',
        version: '121.0.0.0',
        major: '121',
      },
      engine: {
        name: 'Blink',
        version: '121.0.0.0',
      },
      os: {
        name: 'Windows',
        version: '10',
      },
      device: {},
      cpu: {
        architecture: 'amd64',
      },
    },
  })
  @Expose()
  uaResult?: UAResult;

  @ApiProperty({
    required: false,
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  })
  @Expose()
  userAgentData?: string;
}
