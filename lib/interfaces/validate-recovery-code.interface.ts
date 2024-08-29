export interface ValidateRecoveryCodeData {
  email: string;
  recoveryCode: string;
}

export interface ValidateRecoveryCodeResponse {
  recoveryToken: string;
}

export interface ValidateRecoveryCodeErrorResponse {
  message: string;
  statusCode: number;
}
