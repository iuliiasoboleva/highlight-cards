import React from 'react';
import {
  PaginationWrapper,
  PaginationButton,
  PaginationNumbers,
  PaginationInfo,
} from './styles';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <PaginationWrapper>
      <PaginationButton
        onClick={() => handlePageChange(1)}
        disabled={page === 1}
      >
        « Первая
      </PaginationButton>
      
      <PaginationButton
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      >
        ‹ Назад
      </PaginationButton>

      <PaginationNumbers>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          
          return (
            <PaginationButton
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              $active={page === pageNum}
            >
              {pageNum}
            </PaginationButton>
          );
        })}
      </PaginationNumbers>

      <PaginationButton
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      >
        Вперед ›
      </PaginationButton>

      <PaginationButton
        onClick={() => handlePageChange(totalPages)}
        disabled={page === totalPages}
      >
        Последняя »
      </PaginationButton>

      <PaginationInfo>
        Страница {page} из {totalPages}
      </PaginationInfo>
    </PaginationWrapper>
  );
};

export default Pagination;

