class UABrowser {
  name?: string;
  version?: string;
  major?: string;
}

class UADevice {
  model?: string;
  type?: string;
  vendor?: string;
}

class UAEngine {
  name?: string;
  version?: string;
}

class UAOS {
  name?: string;
  version?: string;
}

class UACPU {
  architecture?: string;
}

export interface UAResult {
  ua: string;
  browser: UABrowser;
  device: UADevice;
  engine: UAEngine;
  os: UAOS;
  cpu: UACPU;
}

export interface DeviceResponse {
  id: number;
  deviceKey: string;
  userAgent?: string;
  uaResult?: UAResult;
}

export interface UserDeviceResponse {
  id: number;
  userId: number;
  deviceId: number;
  isCurrentDevice: boolean;
  deviceAlias: string;
  device: DeviceResponse;
}

export interface UpdateDeviceAliasData {
  id: number;
  deviceAlias: string;
}
