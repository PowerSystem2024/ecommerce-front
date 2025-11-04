export interface Product {
  _id: string;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  stock: number;
  category: string | { _id: string; name: string };
  images: string[];
  isActive: boolean;
  averageRating?: number;
  reviewsCount?: number;
  soldCount?: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // For any additional properties
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug?: string;
  isActive?: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  inStock?: boolean;
  sizes?: string[];
  colors?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
