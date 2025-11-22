import React, { useState } from 'react';
import type { Extinguisher } from '../../../../src/api/components/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  items: Extinguisher[];
  onView: (item: Extinguisher) => void;
};

const ITEMS_PER_PAGE = 50;

const ExtinguisherTable: React.FC<Props> = ({ items, onView }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  // Reset to page 1 when items change (e.g., filter applied)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((ext) => (
              <tr key={ext.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{ext.location}</td>
                <td className="px-6 py-4">
                  {ext.site ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                      {ext.site.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">No site</span>
                  )}
                </td>
                <td className="px-6 py-4">{ext.type}</td>
                <td className="px-6 py-4">{ext.status}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onView(ext)} className="text-blue-600 hover:text-blue-900 text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="px-6 py-8 text-sm text-gray-500" colSpan={5}>No extinguishers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, items.length)}</span> of{' '}
              <span className="font-medium">{items.length}</span> extinguishers
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`min-w-[2rem] px-3 py-1 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtinguisherTable;
