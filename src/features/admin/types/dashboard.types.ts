export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
  [key: string]: any; // Para permitir otros filtros
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: OrderSummary[];
  topProducts: TopProduct[];
  salesByCategory: SalesByCategory[];
  monthlySales: MonthlySales[];
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface TopProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
  sales: number;
  rating: number;
  category: string;
}

export interface SalesByCategory {
  category: string;
  count: number;
  total: number;
  percentage: number;
}

export interface MonthlySales {
  month: string;
  year: number;
  total: number;
  count: number;
}

export interface DashboardFilters extends DateRangeFilter {
  status?: string;
  category?: string;
  sortBy?: 'date' | 'total' | 'status';
  order?: 'asc' | 'desc';
}

export interface DashboardOverviewResponse {
  success: boolean;
  data: {
    stats: Omit<DashboardStats, 'recentOrders' | 'topProducts' | 'salesByCategory' | 'monthlySales'>;
  };
}

export interface RecentOrdersResponse {
  success: boolean;
  data: {
    orders: OrderSummary[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface TopProductsResponse {
  success: boolean;
  data: {
    products: TopProduct[];
  };
}

export interface SalesAnalyticsResponse {
  success: boolean;
  data: {
    salesByCategory: SalesByCategory[];
    monthlySales: MonthlySales[];
  };
}
