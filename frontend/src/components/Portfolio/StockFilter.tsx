import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPortfolioFilters, setStockFilter} from '../../features/portfolio/portfolioSlice';
import { Checkbox, FormControlLabel } from '@mui/material';
import { AppDispatch } from '../../store/store';

const StockFilterList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector(selectPortfolioFilters);
  const stockNames = Object.keys(filters.stocks);

  const handleStockFilterChange = (stockName: string) => {
    dispatch(setStockFilter({ 
      stockName, 
      selected: !filters.stocks[stockName] 
    }));
  };

  return (
    <div className="portfolio-page__stock-filters">
      <div className="portfolio-page__stock-checkboxes">
        {stockNames.map(stockName => (
          <FormControlLabel
            key={stockName}
            control={
              <Checkbox
                checked={filters.stocks[stockName] || false}
                onChange={() => handleStockFilterChange(stockName)}
              />
            }
            style={{ marginLeft: '0px' }}
            label={stockName}
            className={filters.stocks[stockName] ? 'stock-filter--selected' : ''}
          />
        ))}
      </div>
    </div>
  );
};

export default StockFilterList;