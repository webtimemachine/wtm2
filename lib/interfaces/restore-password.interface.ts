export interface RestorePasswordData {
  password: string;
  verificationPassword: string;
  deviceKey: string;
  userAgent: string;
  userAgentData: string;
}

// LoginResponse is being used

export interface RestorePasswordErrorResponse {
  message: string;
  statusCode: number;
}
