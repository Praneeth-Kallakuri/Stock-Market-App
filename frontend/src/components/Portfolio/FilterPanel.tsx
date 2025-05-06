import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectPortfolioFilters,
  setSearchFilter,
  setDateFilter,
  setStatusFilter,
  setStockFilter,
  clearAllFilters
} from '../../features/portfolio/portfolioSlice';
import { AppDispatch } from '../../store/store';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import StockFilterList from './StockFilter';

const FilterPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector(selectPortfolioFilters);
  
  return (
    <div className="portfolio-page__filters">
      <div className="portfolio-page__filters-title">
        <p>Filters</p>
        <button 
          className="portfolio-page__filters-clear"
          onClick={() => dispatch(clearAllFilters())}
        >
          Clear All
        </button>
      </div>
      
      <TextField
        className="portfolio-page__search"
        label="Search for a stock"
        variant="outlined"
        value={filters.search}
        onChange={(e) => dispatch(setSearchFilter(e.target.value))}
        fullWidth
      />
      
      <DateFilters 
        startDate={filters.startDate}
        endDate={filters.endDate}
        onDateChange={(dateObj) => dispatch(setDateFilter(dateObj))}
      />
      
      <StatusFilters 
        passed={filters.status.passed}
        failed={filters.status.failed}
        onStatusChange={(statusObj) => dispatch(setStatusFilter(statusObj))}
      />
      
      <StockFilterList />
    </div>
  );
};

interface DateFiltersProps {
  startDate: string;
  endDate: string;
  onDateChange: (dateObj: {startDate?: string, endDate?: string}) => void;
}

const DateFilters: React.FC<DateFiltersProps> = ({ startDate, endDate, onDateChange }) => {
  return (
    <div className="portfolio-page__date-filters">
      <TextField
        type="date"
        label="Start Date"
        value={startDate}
        onChange={(e) => onDateChange({ startDate: e.target.value })}
        InputLabelProps={{ shrink: true }}
        className="portfolio-page__date-input"
      />
      <TextField
        type="date"
        label="End Date"
        value={endDate}
        onChange={(e) => onDateChange({ endDate: e.target.value })}
        InputLabelProps={{ shrink: true }}
        className="portfolio-page__date-input"
      />
    </div>
  );
};

interface StatusFiltersProps {
  passed: boolean;
  failed: boolean;
  onStatusChange: (statusObj: {passed?: boolean, failed?: boolean}) => void;
}

const StatusFilters: React.FC<StatusFiltersProps> = ({ passed, failed, onStatusChange }) => {
  return (
    <div className="portfolio-page__status-filters">
      <FormControlLabel
        control={
          <Checkbox
            checked={passed}
            onChange={() => onStatusChange({ passed: !passed })}
          />
        }
        label="Passed"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={failed}
            onChange={() => onStatusChange({ failed: !failed })}
          />
        }
        label="Failed"
      />
    </div>
  );
};

export default FilterPanel;