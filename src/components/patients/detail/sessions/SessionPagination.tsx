
import React from 'react';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface SessionPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

export const SessionPagination: React.FC<SessionPaginationProps> = ({
  currentPage,
  totalPages,
  changePage
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && changePage(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Show first page, current page, last page, and pages around current
          if (
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationLink 
                  isActive={page === currentPage}
                  onClick={() => changePage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }
          
          // Show ellipsis for skipped pages
          if (page === 2 && currentPage > 3) {
            return <PaginationEllipsis key="ellipsis-start" />;
          }
          
          if (page === totalPages - 1 && currentPage < totalPages - 2) {
            return <PaginationEllipsis key="ellipsis-end" />;
          }
          
          return null;
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && changePage(currentPage + 1)}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
