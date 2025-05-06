import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPortfolioTransactions,
  initializeStockFilters
} from '../features/portfolio/portfolioSlice';
import { AppDispatch } from '../store/store';
import TransactionsList from '../components/Portfolio/TransactionsList';
import FilterPanel from '../components/Portfolio/FilterPanel';
import { Transaction, PortfolioFilters, PortfolioState } from './../types/portfolioTypes';


const PortfolioPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchPortfolioTransactions());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(initializeStockFilters());
  }, [dispatch]);
  
  return (
    <div className="portfolio-page">
      <FilterPanel />
      <TransactionsList />
    </div>
  );
};

export default PortfolioPage;