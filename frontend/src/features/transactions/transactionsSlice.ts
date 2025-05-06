import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  stockName: string;
  symbol: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL';
  timestamp: string;
}

interface TransactionsState {
  transactions: Transaction[];
  walletBalance: number;
  stocksOwned: Record<string, number>;
}

const initialState: TransactionsState = {
  transactions: [],
  walletBalance: 10000, // Initial wallet balance
  stocksOwned: {}
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      const transaction = action.payload;
      state.transactions.push(transaction);
      
      // Update wallet balance and stocks owned
      if (transaction.type === 'BUY') {
        const totalCost = transaction.quantity * transaction.price;
        state.walletBalance -= totalCost;
        
        // Update stocks owned
        if (!state.stocksOwned[transaction.symbol]) {
          state.stocksOwned[transaction.symbol] = 0;
        }
        state.stocksOwned[transaction.symbol] += transaction.quantity;
      } else {
        // SELL transaction
        const totalReturn = transaction.quantity * transaction.price;
        state.walletBalance += totalReturn;
        
        // Update stocks owned
        state.stocksOwned[transaction.symbol] -= transaction.quantity;
      }
    },
    
    setWalletBalance: (state, action: PayloadAction<number>) => {
      state.walletBalance = action.payload;
    }
  }
});

export const { 
  addTransaction,
  setWalletBalance
} = transactionsSlice.actions;

export default transactionsSlice.reducer;