import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordInput {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]{8,20}$/, {
    message:
      'oldPassword must be between 8 and 20 characters long and contain at least one uppercase letter, one lowercase letter, and one digit. Spaces are not allowed.',
  })
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\s]{8,20}$/, {
    message:
      'newPassword must be between 8 and 20 characters long and contain at least one uppercase letter, one lowercase letter, and one digit. Spaces are not allowed.',
  })
  newPassword: string;
}
