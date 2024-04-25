export interface VerifyCodeData {
  verificationCode: string;
  deviceKey: string;
  userAgent: string;
}

export interface VerifyCodeErrorResponse {
  message: string;
  statusCode: number;
}
