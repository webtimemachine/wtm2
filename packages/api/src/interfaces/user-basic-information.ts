export enum UserType {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}
export interface User {
  id: number;
  userType: UserType;
  email: string;
  passChangedAt: string | Date;
  displayname: string;
  profilePicture: string | null | undefined;
}
