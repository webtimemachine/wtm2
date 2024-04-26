export interface VerifyCodeData {
  verificationCode: string;
  deviceKey: string;
  userAgent: string;
}

// LoginResponse is being used

export interface VerifyCodeErrorResponse {
  message: string;
  statusCode: number;
}
