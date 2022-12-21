/**
 * Raw HTTP response data.
 */
export interface HttpResponse<T> {
  meta: {
    request_id: string;
  };

  data?: T;

  error?: {
    code: string;
    message: string;
    description?: string;
  };
}
