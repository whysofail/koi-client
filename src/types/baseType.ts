export interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  count: number;
  page: number;
  limit: number;
}
