import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './../../store/store';
import axios from 'axios';

export interface PortfolioTransaction {
  stock_name: string;
  stock_symbol: string;
  transaction_price: number;
  timestamp: string;
  status: 'Passed' | 'Failed';
}

interface PortfolioTransactionsState {
  transactions: PortfolioTransaction[];
  loading: boolean;
  error: string | null;
  filteredTransactions: PortfolioTransaction[];
  filters: {
    search: string;
    startDate: string;
    endDate: string;
    status: {
      passed: boolean;
      failed: boolean;
    };
    stocks: Record<string, boolean>;
  };
}

const initialState: PortfolioTransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  filteredTransactions: [],
  filters: {
    search: '',
    startDate: '',
    endDate: '',
    status: {
      passed: false,
      failed: false
    },
    stocks: {}
  }
};

// Check if we have transactions in localStorage
const localStorageTransactions = localStorage.getItem('portfolioTransactions');
if (localStorageTransactions) {
  initialState.transactions = JSON.parse(localStorageTransactions);
  initialState.filteredTransactions = JSON.parse(localStorageTransactions);
}

export const fetchPortfolioTransactions = createAsyncThunk(
  'portfolioTransactions/fetchPortfolioTransactions',
  async () => {
    const response = await axios.get('https://dev-1gyvfva3nqtb0v4.api.raw-labs.com/mock/portfolio-transactions');
    return response.data;
  }
);

const portfolioTransactionsSlice = createSlice({
  name: 'portfolioTransactions',
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      applyFilters(state);
    },
    setDateFilter: (state, action: PayloadAction<{ startDate?: string; endDate?: string }>) => {
      if (action.payload.startDate !== undefined) {
        state.filters.startDate = action.payload.startDate;
      }
      if (action.payload.endDate !== undefined) {
        state.filters.endDate = action.payload.endDate;
      }
      applyFilters(state);
    },
    setStatusFilter: (state, action: PayloadAction<{ passed?: boolean; failed?: boolean }>) => {
      if (action.payload.passed !== undefined) {
        state.filters.status.passed = action.payload.passed;
      }
      if (action.payload.failed !== undefined) {
        state.filters.status.failed = action.payload.failed;
      }
      applyFilters(state);
    },
    setStockFilter: (state, action: PayloadAction<{ stockName: string; selected: boolean }>) => {
      state.filters.stocks[action.payload.stockName] = action.payload.selected;
      applyFilters(state);
    },
    clearAllFilters: (state) => {
      state.filters = {
        search: '',
        startDate: '',
        endDate: '',
        status: {
          passed: false,
          failed: false
        },
        stocks: Object.keys(state.filters.stocks).reduce((acc, stockName) => {
          acc[stockName] = false;
          return acc;
        }, {} as Record<string, boolean>)
      };
      state.filteredTransactions = state.transactions;
    },
    initializeStockFilters: (state) => {
      // Get unique stock names
      const stockNames = [...new Set(state.transactions.map(t => t.stock_name))];
      // Initialize filters
      stockNames.forEach(stockName => {
        if (state.filters.stocks[stockName] === undefined) {
          state.filters.stocks[stockName] = false;
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolioTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioTransactions.fulfilled, (state, action: PayloadAction<PortfolioTransaction[]>) => {
        state.transactions = action.payload;
        state.filteredTransactions = action.payload;
        state.loading = false;
        
        // Store in localStorage
        localStorage.setItem('portfolioTransactions', JSON.stringify(action.payload));
        
        // Initialize stock filters with new data
        const stockNames = [...new Set(action.payload.map(t => t.stock_name))];
        stockNames.forEach(stockName => {
          state.filters.stocks[stockName] = false;
        });
      })
      .addCase(fetchPortfolioTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  }
});

// Helper function to apply filters
function applyFilters(state: PortfolioTransactionsState) {
  let filtered = [...state.transactions];
  
  // Applying search filter
  if (state.filters.search) {
    const query = state.filters.search.toLowerCase();
    filtered = filtered.filter(
      t => t.stock_name.toLowerCase().includes(query) || 
           t.stock_symbol.toLowerCase().includes(query)
    );
  }
  
  //status filters
  if (state.filters.status.passed && !state.filters.status.failed) {
    filtered = filtered.filter(t => t.status === 'Passed');
  } else if (!state.filters.status.passed && state.filters.status.failed) {
    filtered = filtered.filter(t => t.status === 'Failed');
  }
  
  //stock filters
  const selectedStocks = Object.keys(state.filters.stocks).filter(stock => state.filters.stocks[stock]);
  if (selectedStocks.length > 0) {
    filtered = filtered.filter(t => selectedStocks.includes(t.stock_name));
  }
  
  // Apply date filters
  if (state.filters.startDate && state.filters.endDate) {
    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.timestamp);
      const start = new Date(state.filters.startDate);
      const end = new Date(state.filters.endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      return transactionDate >= start && transactionDate <= end;
    });
  } else if (state.filters.startDate) {
    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.timestamp);
      const start = new Date(state.filters.startDate);
      return transactionDate >= start;
    });
  } else if (state.filters.endDate) {
    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.timestamp);
      const end = new Date(state.filters.endDate);
      end.setHours(23, 59, 59, 999);
      return transactionDate <= end;
    });
  }
  
  // Sort by date (most recent first)
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  state.filteredTransactions = filtered;
}

export const { 
  setSearchFilter,
  setDateFilter,
  setStatusFilter,
  setStockFilter,
  clearAllFilters,
  initializeStockFilters
} = portfolioTransactionsSlice.actions;

export const selectPortfolioTransactions = (state: RootState) => state.portfolioTransactions.transactions;
export const selectFilteredPortfolioTransactions = (state: RootState) => state.portfolioTransactions.filteredTransactions;
export const selectPortfolioTransactionsLoading = (state: RootState) => state.portfolioTransactions.loading;
export const selectPortfolioFilters = (state: RootState) => state.portfolioTransactions.filters;

export default portfolioTransactionsSlice.reducer;