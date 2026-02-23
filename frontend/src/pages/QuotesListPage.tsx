// src/pages/QuotesListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2, Send, CheckCircle, XCircle, Clock, FileText, Layers } from 'lucide-react';
import HintTooltip from '../components/HintTooltip';
import { fetchQuotes, deleteQuote, updateQuote, fetchQuoteStats } from '../lib/api';
import { BulkQuoteDialog } from '../components/BulkQuoteDialog';
import type { Quote, Extinguisher } from '../types';

const QuotesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showBulkQuoteDialog, setShowBulkQuoteDialog] = useState(false);

  const handleBulkQuoteCreate = (extinguishers: Extinguisher[]) => {
    setShowBulkQuoteDialog(false);
    navigate('/quotes/bulk/create', { state: { extinguishers } });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [quotesData, statsData] = await Promise.all([
        fetchQuotes(statusFilter || undefined),
        fetchQuoteStats(),
      ]);
      setQuotes(quotesData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      await deleteQuote(id);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete quote');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateQuote(id, { status: status as any });
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update quote status');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      expired: 'bg-orange-100 text-orange-700',
    };

    const icons = {
      draft: FileText,
      sent: Send,
      accepted: CheckCircle,
      rejected: XCircle,
      expired: Clock,
    };

    const Icon = icons[status as keyof typeof icons] || FileText;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${styles[status as keyof typeof styles] || styles.draft}`}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading quotes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Quotes</h1>
        <p className="text-gray-600">Manage quotes for extinguisher repairs and services</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-6 mb-6 md:grid-cols-4">
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Total Quotes</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="mt-2 text-sm text-gray-600">£{stats.totalValue.toFixed(2)} total value</div>
          </div>
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Accepted</div>
            <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
            <div className="mt-2 text-sm text-gray-600">£{stats.acceptedValue.toFixed(2)} revenue</div>
          </div>
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-3xl font-bold text-blue-600">{stats.sent}</div>
            <div className="mt-2 text-sm text-gray-600">Awaiting response</div>
          </div>
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Acceptance Rate</div>
            <div className="text-3xl font-bold text-indigo-600">{stats.acceptanceRate.toFixed(0)}%</div>
            <div className="mt-2 text-sm text-gray-600">From sent quotes</div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowBulkQuoteDialog(true)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Layers size={18} />
            Generate Bulk Quote
          </button>
          <HintTooltip
            storageKey="bulk_quote"
            content="Filter extinguishers by site, building, or condition to generate one quote covering multiple units at once."
          />
        </div>
      </div>

      {/* Bulk Quote Dialog */}
      <BulkQuoteDialog
        isOpen={showBulkQuoteDialog}
        onClose={() => setShowBulkQuoteDialog(false)}
        onCreateQuote={handleBulkQuoteCreate}
      />

      {/* Quotes Table */}
      <div className="bg-white border rounded-lg shadow-sm">
        {quotes.length === 0 ? (
          <div className="py-12 text-center">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="mb-4 text-gray-500">No quotes found</p>
            <p className="mb-6 text-sm text-gray-400">
              Create a quote from a failed inspection or add one manually
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Quote #
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Extinguisher
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{quote.quoteNumber}</div>
                      <div className="text-sm text-gray-500">
                        Valid until {new Date(quote.validUntil).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {quote.isBulkQuote ? (
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            <Layers size={16} className="text-violet-500" />
                            Bulk Quote
                          </div>
                          <div className="text-sm text-gray-500">
                            {(() => {
                              const uniqueExtIds = new Set(quote.lines.map(l => l.extinguisherId).filter(Boolean));
                              return `${uniqueExtIds.size} extinguisher${uniqueExtIds.size !== 1 ? 's' : ''}`;
                            })()}
                          </div>
                        </div>
                      ) : quote.extinguisher ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {quote.extinguisher.building} - {quote.extinguisher.location}
                          </div>
                          <div className="text-sm text-gray-500">
                            {quote.extinguisher.type} {quote.extinguisher.capacity}
                          </div>
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quote.createdBy || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        £{quote.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quote.lines.length} line{quote.lines.length !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/quotes/${quote.id}`)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="View quote"
                        >
                          <Eye size={18} />
                        </button>
                        {quote.status === 'draft' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(quote.id, 'sent')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Send to customer"
                            >
                              <Send size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(quote.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete quote"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                        {quote.status === 'sent' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(quote.id, 'accepted')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Mark as accepted"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(quote.id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Mark as rejected"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotesListPage;
