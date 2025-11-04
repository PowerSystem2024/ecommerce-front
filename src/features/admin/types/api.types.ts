// Base API response type
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Standard pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Standard error response
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Common filter parameters
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export type SortOrder = 'asc' | 'desc';
