import React, { useRef, useEffect } from 'react';
import { Transaction } from './../../types/index';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const historyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="history-panel">
      <h3>Transaction History</h3>
      <div className="history-container" ref={historyRef}>
        {transactions.length === 0 ? (
          <div className="no-transactions">No transactions yet</div>
        ) : (
          transactions.map((transaction, index) => (
            <div 
              key={index} 
              className={`transaction-item ${transaction.type === 'BUY' ? 'buy' : 'sell'}`}
            >
              <div className="transaction-details">
                <span className="transaction-quantity">{transaction.quantity} stocks</span>
                <span className="transaction-timestamp">
                  {new Date(transaction.timestamp).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
              <div className={`transaction-type ${transaction.type === 'BUY' ? 'buy' : 'sell'}`}>
                {transaction.type}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;