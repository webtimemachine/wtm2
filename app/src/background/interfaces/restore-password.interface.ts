export interface RestorePasswordData {
  password: string;
  verificationPassword: string;
  deviceKey: string;
  userAgent: string;
}

// LoginResponse is being used

export interface RestorePasswordErrorResponse {
  message: string;
  statusCode: number;
}
