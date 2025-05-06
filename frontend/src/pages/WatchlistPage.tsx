import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import StockList from '../components/Dashboard/StockList';
import Pagination from '../components/Dashboard/Pagination';

const WatchlistPage: React.FC = () => {
  const { stocks, watchlist, currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.stocks
  );

  // Filter stocks that are in the watchlist
  const watchlistStocks = stocks.filter(stock => 
    watchlist.includes(stock.stock_symbol)
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = watchlistStocks.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="watchlist-page">
      {watchlistStocks.length === 0 ? (
        <div className="empty-watchlist">
          <p>Your watchlist is empty. Add stocks from the Explore tab.</p>
        </div>
      ) : (
        <>
          <StockList stocks={currentStocks} />
          <Pagination totalItems={watchlistStocks.length} />
        </>
      )}
    </div>
  );
};

export default WatchlistPage;