import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getStocks } from './../features/dashboard/dashboardSlice';
import StockList from '../components/Dashboard/StockList';
import Pagination from '../components/Dashboard/Pagination';
import Spinner from '../components/Dashboard/Spinner';

const ExplorePage: React.FC = () => {
  const dispatch = useDispatch();
  const { stocks, loading, error, currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.stocks
  );

  useEffect(() => {
    dispatch(getStocks());
  }, [dispatch]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = stocks.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="explore-page">
      <StockList stocks={currentStocks} />
      <Pagination totalItems={stocks.length} />
    </div>
  );
};

export default ExplorePage;