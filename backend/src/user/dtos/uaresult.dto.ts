import { Expose, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
class UABrowser {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  name?: string;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  version?: string;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  major?: string;
}

@Exclude()
class UADevice {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  model?: string;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  type?: string;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  vendor?: string;
}

@Exclude()
class UAEngine {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  name?: string;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  version?: string;
}

@Exclude()
class UAOS {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  name?: string;

  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  version?: string;
}

@Exclude()
class UACPU {
  @ApiProperty({ required: false, type: 'string' })
  @Expose()
  architecture?: string;
}

@Exclude()
export class UAResult {
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
