import { useCallback } from 'react';

export const usePagination = (
  currentPage: number, 
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>, 
  totalPages: number
) => {

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(p => p + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  }, [currentPage]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    nextPage,
    prevPage,
    resetPage,
  };
};