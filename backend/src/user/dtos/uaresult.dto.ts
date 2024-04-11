import { Expose, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import UAParser from 'ua-parser-js';

@Exclude()
class UABrowser implements UAParser.IBrowser {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  name: string | undefined;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  version: string | undefined;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  major: string | undefined;
}

@Exclude()
class UADevice implements UAParser.IDevice {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  model: string | undefined;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  type: string | undefined;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  vendor: string | undefined;
}

@Exclude()
class UAEngine implements UAParser.IEngine {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  name: string | undefined;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  version: string | undefined;
}

@Exclude()
class UAOS implements UAParser.IOS {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  name: string | undefined;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  version: string | undefined;
}

@Exclude()
class UACPU implements UAParser.ICPU {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  architecture: string | undefined;
}

@Exclude()
export class UAResult implements UAParser.IResult {
  @ApiProperty()
  @Expose()
  ua: string;

  @ApiProperty({ type: () => UABrowser })
  @Expose()
  browser: UABrowser;

  @ApiProperty({ type: () => UADevice })
  @Expose()
  device: UADevice;

  @ApiProperty({ type: () => UAEngine })
  @Expose()
  engine: UAEngine;

  @ApiProperty({ type: () => UAOS })
  @Expose()
  os: UAOS;

  @ApiProperty({ type: () => UACPU })
  @Expose()
  cpu: UACPU;
}
