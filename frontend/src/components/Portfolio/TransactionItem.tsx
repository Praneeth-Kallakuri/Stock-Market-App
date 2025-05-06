import React from 'react';
import { format } from 'date-fns';

interface TransactionItemProps {
  transaction: {
    stock_name: string;
    stock_symbol: string;
    transaction_price: number;
    timestamp: string;
    status: 'Passed' | 'Failed';
  };
  isFaded: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, isFaded }) => {
  return (
    <div className={`transaction-item ${isFaded ? 'transaction-item--faded' : ''}`}>
      <div className="transaction-item__details">
        <div className="transaction-item__stock">
          <p className="transaction-item__stock-name">
            {transaction.stock_name}
          </p>
        </div>
        <p className="transaction-item__stock-symbol">
          {transaction.stock_symbol}
        </p>
        <p className="transaction-item__price">
          ₹{transaction.transaction_price.toFixed(2)}
        </p>
        <div className="transaction-item__time-status">
          <p className="transaction-item__time">
            {format(new Date(transaction.timestamp), 'h:mm a')}
          </p>
          <div className={`transaction-item__status transaction-item__status--${transaction.status.toLowerCase()}`}>
            <span className="transaction-item__status-dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;