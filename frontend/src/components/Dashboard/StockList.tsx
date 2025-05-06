import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addToWatchlist, removeFromWatchlist } from '../../features/dashboard/dashboardSlice';
import { Stock } from '../../types';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface StockListProps {
  stocks: Stock[];
}

const StockList: React.FC<StockListProps> = ({ stocks }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const watchlist = useSelector((state: RootState) => state.stocks.watchlist);

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const handleAddToWatchlist = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    dispatch(addToWatchlist(symbol));
  };

  const handleRemoveFromWatchlist = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    dispatch(removeFromWatchlist(symbol));
  };

  return (
    <div className="stock-list">
      <div className="stock-list__header">
        <div className="stock-list__column stock-list__column--company">Company</div>
        <div className="stock-list__column stock-list__column--price">Base Price</div>
        <div className="stock-list__column stock-list__column--watchlist">Watchlist</div>
      </div>
      
      {stocks.map((stock) => (
        <div 
          key={stock.stock_symbol} 
          className="stock-list__item"
          onClick={() => handleStockClick(stock.stock_symbol)}
        >
          <div className="stock-list__column stock-list__column--company">
            {stock.stock_name}
          </div>
          <div className="stock-list__column stock-list__column--price">
            ₹{stock.base_price.toFixed(2)}
          </div>
          <div className="stock-list__column stock-list__column--watchlist">
            {watchlist.includes(stock.stock_symbol) ? (
              <div className="stock-list__watchlist-btn stock-list__watchlist-btn--added">
                <CheckIcon />
                <div className="stock-list__remove-icon" onClick={(e) => handleRemoveFromWatchlist(e, stock.stock_symbol)}>
                  <CloseIcon />
                </div>
              </div>
            ) : (
              <div 
                className="stock-list__watchlist-btn" 
                onClick={(e) => handleAddToWatchlist(e, stock.stock_symbol)}
              >
                <AddIcon />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockList;