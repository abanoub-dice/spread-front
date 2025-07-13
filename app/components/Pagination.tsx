import { Box, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import React, { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const iconButtonSx = {
  border: '1px solid',
  borderRadius: '50%',
  height: '30px',
  width: '30px',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  }
} as const;

const pageButtonSx = (active: boolean) => ({
  minWidth: 'unset',
  mx: 0.5,
  borderRadius: '50%',
  height: '30px',
  width: '30px',
  border: active ? '1px solid transparent' : '1px solid',
  ...(active
    ? {}
    : {
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        },
      }),
}) as const;

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Memoize page numbers to avoid unnecessary re-renders
  const pageButtons = useMemo(() => {
    return Array.from({ length: totalPages }, (_, idx) => {
      const page = idx + 1;
      const isActive = currentPage === page;
      return (
        <Button
          key={page}
          variant={isActive ? 'contained' : 'outlined'}
          onClick={() => onPageChange(page)}
          sx={pageButtonSx(isActive)}
        >
          {page}
        </Button>
      );
    });
  }, [currentPage, totalPages, onPageChange]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 1 }}>
      <IconButton
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        sx={{
          ...iconButtonSx,
          color: currentPage > 1 ? 'primary.main' : 'inherit',
        }}
        aria-label="Previous Page"
      >
        <ChevronLeft />
      </IconButton>

      {pageButtons}

      <IconButton
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        sx={{
          ...iconButtonSx,
          color: currentPage < totalPages ? 'primary.main' : 'inherit',
        }}
        aria-label="Next Page"
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default Pagination; 