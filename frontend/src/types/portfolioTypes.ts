
export interface Transaction {
    stock_name: string;
    stock_symbol: string;
    transaction_price: number;
    timestamp: string;
    status: 'Passed' | 'Failed';
  }
  
  export interface PortfolioFilters {
    search: string;
    startDate: string;
    endDate: string;
    status: {
      passed: boolean;
      failed: boolean;
    };
    stocks: {
      [stockName: string]: boolean;
    };
  }
  
  export interface PortfolioState {
    transactions: Transaction[];
    filteredTransactions: Transaction[];
    isLoading: boolean;
    error: string | null;
    filters: PortfolioFilters;
  }