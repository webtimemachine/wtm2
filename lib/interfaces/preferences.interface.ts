export interface UpdatePreferenciesData {
  enableNavigationEntryExpiration: boolean;
  navigationEntryExpirationInDays: number;
  enableImageEncoding: boolean;
  enableExplicitContentFilter: boolean;
  enableStopTracking: boolean;
}

export interface PreferenciesResponse {
  id: number;
  userId: number;
  enableNavigationEntryExpiration: boolean;
  navigationEntryExpirationInDays: number;
  enableImageEncoding: boolean;
  enableExplicitContentFilter: boolean;
  enableStopTracking: boolean;
}
