'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationComponentProps {
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  siblingsCount?: number;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({
  totalRecords,
  pageSize,
  currentPage,
  siblingsCount = 1,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalRecords / pageSize);

  const generatePagesArray = (from: number, to: number) => {
    return [...Array(to - from + 1)].map((_, index) => from + index);
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams((searchParams ?? '').toString());
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const calculatePagesToShow = () => {
    if (totalPages <= 5) {
      return generatePagesArray(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 2);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages - 1);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = generatePagesArray(1, rightSiblingIndex);
      return [...leftRange, 'ellipsis', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = generatePagesArray(leftSiblingIndex, totalPages);
      return [1, 'ellipsis', ...rightRange];
    }

    return [
      1,
      shouldShowLeftDots ? 'ellipsis' : 2,
      ...generatePagesArray(leftSiblingIndex, rightSiblingIndex),
      shouldShowRightDots ? 'ellipsis' : totalPages - 1,
      totalPages,
    ];
  };

  const pages = calculatePagesToShow();

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink href={createPageUrl(Number(page))} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
