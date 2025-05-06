import React from 'react';
import { Link } from 'react-router-dom';
import ChartIcon from '@mui/icons-material/ShowChart';

const Header: React.FC = () => {
  // Links to Portfolio and Summarizer
  return (
    <header className="header">
      <div className="header__logo-container">
        <ChartIcon className="header__logo-icon" />
        <Link to="/" className="header__logo-text">
          KDU Stock Market
        </Link>
      </div>
      <nav className="header__nav">
        <Link to="/" className="header__nav-link">
          Summarizer
        </Link>
        <Link to="/portfolio" className="header__nav-link">
          My Portfolio
        </Link>
      </nav>
    </header>
  );
};

export default Header;