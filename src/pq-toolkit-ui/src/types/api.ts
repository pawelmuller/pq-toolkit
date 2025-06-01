export interface APIError {
  msg: string;
  status: number;
}

export interface APIResponse<T> {
  data: T;
  error: null;
}

export interface APIErrorResponse {
  data: null;
  error: APIError;
}

export type APIResult<T> = APIResponse<T> | APIErrorResponse; 