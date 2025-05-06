export interface Stock {
  stock_name: string;
  stock_symbol: string;
  base_price: number;
}
export interface Stock {
stock_name: string;
stock_symbol: string;
base_price: number;
}

export interface Transaction {
stockName: string;
symbol: string;
quantity: number;
price: number;
type: 'BUY' | 'SELL';
timestamp: string;
}

export interface LiveNotification {
user: string;
stockName: string;
quantity: number;
type: 'bought' | 'sold';
timestamp: string;
}