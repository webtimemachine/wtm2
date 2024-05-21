import { UserDevice } from './user-device.interface';

export interface CompleteNavigationEntryDto {
  id: number;
  url: string;
  title: string;
  navigationDate: Date;
  userId: number;
  userDeviceId: number;
  userDevice: UserDevice;
  expirationDate?: Date;
}

export interface GetNavigationEntriesResponse {
  offset: number;
  limit: number;
  count: number;
  query: string;
  items: CompleteNavigationEntryDto[];
}

export interface GetNavigationEntriesData {
  offset: number;
  limit: number;
  query: string;
  isSemantic: boolean;
}

export interface DeleteNavigationEntriesData {
  id: number;
}

export interface CreateNavigationEntry {
  url: string;
  navigationDate: string;
  title: string;
  content?: string;
}
