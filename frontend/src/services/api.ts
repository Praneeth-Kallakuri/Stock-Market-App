import axios from 'axios';
import { Stock } from '../types';

export interface StockData {
  company: string;
  symbol: string;
  data: {
    date: string;
    prices: number[];
  }[];
}

export interface Transaction {
  stock_name: string;
  stock_symbol: string;
  transaction_price: number;
  timestamp: string;
  status: 'Passed' | 'Failed';
}

// API endpoints
const API_ENDPOINTS = {
  API_URL : 'https://dev-1gyvfva3nqtb0v4.api.raw-labs.com/mock/stocks',
  ALL_STOCKS: 'https://dev-1gyvfva3nqtb0v4.api.raw-labs.com/mock/all-stocks-transactions',
  PORTFOLIO_TRANSACTIONS: 'https://dev-1gyvfva3nqtb0v4.api.raw-labs.com/mock/portfolio-transactions'
};

export const fetchStocks = async (): Promise<Stock[]> => {
  try {
    const response = await axios.get<Stock[]>(API_ENDPOINTS.API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

