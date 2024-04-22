interface UABrowser {
  name?: string;
  version?: string;
  major?: string;
}
interface UADevice {
  model?: string;
  type?: string;
  vendor?: string;
}
interface UAEngine {
  name?: string;
  version?: string;
}
interface UAOS {
  name?: string;
  version?: string;
}
interface UACPU {
  architecture?: string;
}
interface UAResult {
  ua: string;
  browser: UABrowser;
  device: UADevice;
  engine: UAEngine;
  os: UAOS;
  cpu: UACPU;
}

interface DeviceDto {
  id: number;
  deviceKey: string;
  userAgent?: string;
  uaResult?: UAResult;
}

interface UserDeviceDto {
  id: number;
  userId: number;
  deviceId: number;
  isCurrentDevice: boolean;
  deviceAlias: string;
  device: DeviceDto;
}

export interface CompleteNavigationEntryDto {
  id: number;
  url: string;
  title: string;
  navigationDate: Date;
  userId: number;
  userDeviceId: number;
  userDevice: UserDeviceDto;
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
