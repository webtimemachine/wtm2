import { Expose, Exclude } from 'class-transformer';
import { UserPreferencesDto } from './user-preferences.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

@Exclude()
export class UserDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ enum: UserType })
  @Expose()
  userType: UserType;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty({ type: () => UserPreferencesDto })
  @Expose()
  userPreferences: UserPreferencesDto;
}
