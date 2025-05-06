import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './../store/store';
import { addTransaction } from './../features/transactions/transactionsSlice';
import Spinner from './../components/Dashboard/Spinner';
import StockHeader from './../components/Stocks/StockHeader';
import StockChart from './../components/Stocks/StockChart';
import TransactionHistory from './../components/Stocks/TransactionHistory';
import LiveNotifications from './../components/Stocks/LiveNotifications';
import { Stock, Transaction, LiveNotification } from './../types/index';

const StockDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const wallet = useSelector((state: RootState) => state.transactions.walletBalance);
  const stocksOwned = useSelector((state: RootState) => state.transactions.stocksOwned);
  
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [chartData, setChartData] = useState<{ price: number; color: string }[]>([]);
  const [stockTransactions, setStockTransactions] = useState<Transaction[]>([]);
  const [liveNotifications, setLiveNotifications] = useState<LiveNotification[]>([]);
  const [previousPrice, setPreviousPrice] = useState<number>(0);
  
  // Fetch stocks data
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('https://dev-1gyvfva3nqtb0v4.api.raw-labs.com/mock/stocks');
        const data = await response.json();
        setAllStocks(data);
        
        // Find the selected stock
        const stock = data.find((s: Stock) => s.stock_symbol === symbol);
        if (stock) {
          setSelectedStock(stock);
          // Set initial price as the base price
          setCurrentPrice(stock.base_price);
          setPreviousPrice(stock.base_price);
        } else if (data.length > 0) {
          // If symbol not found, use the first stock
          setSelectedStock(data[0]);
          navigate(`/stock/${data[0].stock_symbol}`, { replace: true });
        }
      } catch (error) {
        console.error('Error fetching stocks data:', error);
      }
    };

    fetchStocks();
  }, [symbol, navigate]);

  // Filter transactions for current stock
  useEffect(() => {
    if (selectedStock && transactions) {
      const filtered = transactions.filter(
        (transaction: Transaction) => transaction.symbol === selectedStock.stock_symbol
      );
      setStockTransactions(filtered);
    }
  }, [selectedStock, transactions]);

  // Simulate price changes and live notifications
  useEffect(() => {
    if (!selectedStock) return;
    
    const users = ['Sagun', 'Aakash', 'Amey', 'Riya', 'Priya', 'Rahul'];
    
    const priceInterval = setInterval(() => {
      // Random price change between -5% and 5% of current price
      const changePercent = (Math.random() * 10) - 5;
      const change = (currentPrice * changePercent) / 100;
      const newPrice = Math.max(1, Math.min(400, currentPrice + change));
      
      setPreviousPrice(currentPrice);
      setCurrentPrice(newPrice);
      
      setPriceChange(changePercent);
      
      // Update chart data
      setChartData(prevData => {
        const newData = [...prevData, {
          price: newPrice,
          color: newPrice >= previousPrice ? '#a7f3d0' : '#fecaca'
        }];
        
        // Keep only the last 42 data points
        if (newData.length > 42) {
          return newData.slice(newData.length - 42);
        }
        return newData;
      });
      
      // Random chance to generate a notification
      if (Math.random() > 0.7) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const quantity = Math.floor(Math.random() * 10) * 50 + 50;
        const type = Math.random() > 0.5 ? 'bought' : 'sold';
        
        const newNotification: LiveNotification = {
          user: randomUser,
          stockName: selectedStock.stock_name,
          quantity,
          type,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setLiveNotifications(prev => {
          const updated = [newNotification, ...prev];
          if (updated.length > 50) {
            return updated.slice(0, 50);
          }
          return updated;
        });
      }
    }, 3000);
    
    return () => {
      clearInterval(priceInterval);
    };
  }, [currentPrice, previousPrice, selectedStock]);

  const handleStockChange = (stock: Stock) => {
    navigate(`/stock/${stock.stock_symbol}`);
    setChartData([]);
  };

  const handleTransaction = (type: 'BUY' | 'SELL', quantity: number) => {
    if (!selectedStock || quantity <= 0) return;
    
    if (type === 'BUY') {
      const totalCost = quantity * currentPrice;
      if (totalCost > wallet) {
        alert('Insufficient funds in wallet!');
        return;
      }
    } else {
      const ownedQty = stocksOwned[selectedStock.stock_symbol] || 0;
      if (quantity > ownedQty) {
        alert(`You only own ${ownedQty} shares of ${selectedStock.stock_name}!`);
        return;
      }
    }
    
    const transaction: Transaction = {
      stockName: selectedStock.stock_name,
      symbol: selectedStock.stock_symbol,
      quantity,
      price: currentPrice,
      type,
      timestamp: new Date().toISOString()
    };
    
    dispatch(addTransaction(transaction));
  };

  if (!selectedStock) {
    return <Spinner />;
  }

  return (
    <div className="stock-detail-page">
      <div className="stock-detail-content">
        <StockHeader 
          selectedStock={selectedStock}
          allStocks={allStocks}
          currentPrice={currentPrice}
          priceChange={priceChange}
          onStockChange={handleStockChange}
          onTransaction={handleTransaction}
        />
        
        <StockChart chartData={chartData} />
      </div>
      
      <div className="side-panels">
        <TransactionHistory transactions={stockTransactions} />
        <LiveNotifications notifications={liveNotifications} />
      </div>
    </div>
  );
};

export default StockDetailPage;