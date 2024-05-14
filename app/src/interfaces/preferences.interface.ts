export interface UpdatePreferenciesData {
  enableNavigationEntryExpiration: boolean;
  navigationEntryExpirationInDays: number;
}

export interface PreferenciesResponse {
  id: number;
  userId: number;
  enableNavigationEntryExpiration: boolean;
  navigationEntryExpirationInDays: number;
}
