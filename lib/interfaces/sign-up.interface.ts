export interface SignUpData {
  email: string;
  password: string;
}

export interface SignUpResponse {
  id: number;
  email: string;
  partialToken: string;
}

export interface SignUpErrorResponse {
  statusCode: number;
  error?: string;
  message: string | string[];
}
