import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Spinner: React.FC = () => {
  return (
    <div className="spinner">
      <CircularProgress />
    </div>
  );
};

export default Spinner;