import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectFilteredPortfolioTransactions, 
  selectPortfolioTransactionsLoading,
  selectPortfolioFilters
} from '../../features/portfolio/portfolioSlice';
import Spinner from '../../components/Dashboard/Spinner';
import { format } from 'date-fns';
import TransactionItem from './TransactionItem';

interface GroupedTransactions {
  [date: string]: {
    stock_name: string;
    stock_symbol: string;
    transaction_price: number;
    timestamp: string;
    status: 'Passed' | 'Failed';
  }[];
}

const TransactionsList: React.FC = () => {
  const transactions = useSelector(selectFilteredPortfolioTransactions);
  const isLoading = useSelector(selectPortfolioTransactionsLoading);
  const filters = useSelector(selectPortfolioFilters);
  
  // Group transactions by date
  const groupTransactionsByDate = (): GroupedTransactions => {
    return transactions.reduce((groups, transaction) => {
      const date = format(new Date(transaction.timestamp), 'dd MMM yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as GroupedTransactions);
  };
  
  const groupedTransactions = groupTransactionsByDate();
  
  if (isLoading) {
    return <Spinner />;
  }
  
  if (transactions.length === 0) {
    return (
      <div className="portfolio-page__no-transactions">
        <p>No transactions found. Try adjusting your filters.</p>
      </div>
    );
  }
  
  return (
    <div className="portfolio-page__transactions">
      {Object.keys(groupedTransactions).map((date) => (
        <div key={date} className="transaction-group">
          <h2 className="transaction-group__date">{date}</h2>
          <div className="transaction-group__items">
            {groupedTransactions[date].map((transaction, index) => (
              <TransactionItem 
                key={index} 
                transaction={transaction}
                isFaded={Object.values(filters.stocks).some(v => v) && !filters.stocks[transaction.stock_name]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsList;