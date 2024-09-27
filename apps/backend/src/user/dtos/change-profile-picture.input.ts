import { ApiProperty } from '@nestjs/swagger';

export class ChangeProfilePictureInput {
  @ApiProperty()
  profilePicture: string;
}
