import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrentPage } from '../../features/dashboard/dashboardSlice';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface PaginationProps {
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems }) => {
  const dispatch = useDispatch();
  const { currentPage, itemsPerPage } = useSelector((state: RootState) => state.stocks);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    
    // Show first page
    pages.push(1);
    
    // Current page with neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Adding ellipsis and last page
    if (totalPages > 1) {
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="pagination">
      <button 
        className="pagination__arrow"
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </button>
      
      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination__ellipsis">...</span>
        ) : (
          <button
            key={`page-${page}`}
            className={`pagination__page ${currentPage === page ? 'pagination__page--active' : ''}`}
            onClick={() => handlePageClick(page as number)}
          >
            {page}
          </button>
        )
      ))}
      
      <button 
        className="pagination__arrow"
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default Pagination;