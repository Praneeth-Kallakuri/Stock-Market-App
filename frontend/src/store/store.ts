import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './../features/dashboard/dashboardSlice';
import transactionsReducer from './../features/transactions/transactionsSlice';
import portfolioTransactionsReducer from './../features/portfolio/portfolioSlice';

export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    transactions: transactionsReducer,
    portfolioTransactions: portfolioTransactionsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
