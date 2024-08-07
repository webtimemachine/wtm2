export interface RecoverPasswordData {
  email: string;
}

export interface RecoverPasswordResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}
