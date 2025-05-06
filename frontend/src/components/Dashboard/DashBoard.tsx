import React, { useState } from 'react';
import ExplorePage from '../../pages/ExplorePage';
import WatchlistPage from '../../pages/WatchlistPage';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'watchlist'>('explore');

  return (
    <div className="dashboard">
      <div className="dashboard__tabs">
        <button 
          className={`dashboard__tab ${activeTab === 'explore' ? 'dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          Explore
        </button>
        <button 
          className={`dashboard__tab ${activeTab === 'watchlist' ? 'dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          My Watchlist
        </button>
      </div>
      
      <div className="dashboard__content">
        {activeTab === 'explore' ? <ExplorePage /> : <WatchlistPage />}
      </div>
    </div>
  );
};

export default Dashboard;