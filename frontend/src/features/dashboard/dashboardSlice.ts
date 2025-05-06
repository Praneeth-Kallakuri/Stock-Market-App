import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Stock } from './../../types/index';
import { fetchStocks } from './../../services/api';

interface StocksState {
  stocks: Stock[];
  watchlist: string[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: StocksState = {
  stocks: [],
  watchlist: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10
};

// Load watchlist from localStorage on initialization
const savedWatchlist = localStorage.getItem('watchlist');
if (savedWatchlist) {
  initialState.watchlist = JSON.parse(savedWatchlist);
}


export const getStocks = createAsyncThunk(
  'stocks/getStocks',
  async (_, { rejectWithValue }) => {
    const cache = localStorage.getItem('stocks');
    const timestamp = localStorage.getItem('stocks_timestamp');
    
    const CACHE_TIME_LIMIT = 60 * 60 * 1000; // 1 hour cache validity

    const now = new Date().getTime();
    
    // Check if the cache is still valid
    if (cache && timestamp && (now - parseInt(timestamp)) < CACHE_TIME_LIMIT) {
      return JSON.parse(cache); // Return cached data if valid
    }

    try {
      const stocks = await fetchStocks();
      // Save the fetched data and timestamp to localStorage
      localStorage.setItem('stocks', JSON.stringify(stocks));
      localStorage.setItem('stocks_timestamp', now.toString());
      return stocks;
    } catch (error) {
      return rejectWithValue('Failed to fetch stocks');
    }
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<string>) => {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload);
        // Save to localStorage
        localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter(symbol => symbol !== action.payload);
      // Save to localStorage
      localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStocks.fulfilled, (state, action: PayloadAction<Stock[]>) => {
        state.loading = false;
        // Sort stocks by name
        state.stocks = action.payload.sort((a, b) => 
          a.stock_name.localeCompare(b.stock_name)
        );
      })
      .addCase(getStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  
  }
});

export const { addToWatchlist, removeFromWatchlist, setCurrentPage } = stocksSlice.actions;
export default stocksSlice.reducer;