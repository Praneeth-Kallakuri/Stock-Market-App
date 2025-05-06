import React, { useState } from 'react';
import { Stock } from './../../types/index';

interface StockHeaderProps {
  selectedStock: Stock;
  allStocks: Stock[];
  currentPrice: number;
  priceChange: number;
  onStockChange: (stock: Stock) => void;
  onTransaction: (type: 'BUY' | 'SELL', quantity: number) => void;
}

const StockHeader: React.FC<StockHeaderProps> = ({
  selectedStock,
  allStocks,
  currentPrice,
  priceChange,
  onStockChange,
  onTransaction
}) => {
  const [quantity, setQuantity] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allowing only numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setQuantity(value);
  };

  const handleStockChange = (stock: Stock) => {
    onStockChange(stock);
    setDropdownOpen(false);
  };

  const handleBuy = () => {
    if (!quantity) return;
    onTransaction('BUY', parseInt(quantity));
    setQuantity('');
  };

  const handleSell = () => {
    if (!quantity) return;
    onTransaction('SELL', parseInt(quantity));
    setQuantity('');
  };

  return (
    <div className="stock-header">
      <div className="stock-selector">
        <div 
          className="selected-stock" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="stock-symbol">{selectedStock.stock_symbol}</div>
          <div className="stock-name">{selectedStock.stock_name}</div>
          <span className="dropdown-arrow">▼</span>
        </div>
        
        {dropdownOpen && (
          <div className="stock-dropdown">
            {allStocks.map((stock) => (
              <div
                key={stock.stock_symbol}
                className="dropdown-item"
                onClick={() => handleStockChange(stock)}
              >
                <div className="stock-symbol">{stock.stock_symbol}</div>
                <div className="stock-name">{stock.stock_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="price-indicator">
        <span className="price-label">Price</span>
        <span className={`current-price ${priceChange >= 0 ? 'positive' : 'negative'}`}>
          {currentPrice.toFixed(2)}
          <span className="price-arrow">
            {priceChange >= 0 ? '▲' : '▼'}
          </span>
        </span>
        <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
          {Math.abs(priceChange).toFixed(2)}%
        </span>
      </div>
      
      <div className="transaction-controls">
        <input
          type="text"
          placeholder="Enter QTY"
          value={quantity}
          onChange={handleQuantityChange}
          className="quantity-input"
        />
        <button className="buy-button" onClick={handleBuy}>BUY</button>
        <button className="sell-button" onClick={handleSell}>SELL</button>
      </div>
    </div>
  );
};

export default StockHeader;