import { Stock } from '../types';

export const fetchStocks = async (): Promise<Stock[]> => {
  try {
    const response = await fetch('https://dev-1gyvfva3nqtb0v4.api.raw-labs.com/mock/stocks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stocks data:', error);
    throw error;
  }
};

export const simulatePriceChange = (currentPrice: number): {
  newPrice: number;
  changePercent: number;
} => {
  // Random price change between -5% and 5% of current price
  const changePercent = (Math.random() * 10) - 10;
  const change = (currentPrice * changePercent) / 100;
  const newPrice = Math.max(1, Math.min(400, currentPrice + change));
  
  return {
    newPrice,
    changePercent
  };
};

export const generateRandomNotification = (
  stockName: string,
  users: string[] = ['Sagun', 'Aakash', 'Amey', 'Riya', 'Priya', 'Rahul']
) => {
  const randomUser = users[Math.floor(Math.random() * users.length)];
  const quantity = Math.floor(Math.random() * 10) * 50 + 50;
  const type = Math.random() > 0.5 ? 'bought' : 'sold';
  
  return {
    user: randomUser,
    stockName,
    quantity,
    type,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};