// src/pages/QuoteDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { fetchQuoteById, updateQuote, deleteQuote } from '../lib/api';
import type { Quote } from '../types';

const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuote = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await fetchQuoteById(id);
        setQuote(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quote');
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!id) return;

    try {
      const updated = await updateQuote(id, { status: status as any });
      setQuote(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update quote');
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this quote?')) return;

    try {
      await deleteQuote(id);
      navigate('/quotes');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete quote');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading quote...</div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="p-6">
        <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error || 'Quote not found'}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      expired: 'bg-orange-100 text-orange-700',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded ${styles[status as keyof typeof styles] || styles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/quotes')}
          className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Quotes
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quote.quoteNumber}</h1>
            <p className="text-gray-600">
              Created {new Date(quote.createdAt).toLocaleDateString()} by {quote.createdBy || 'Unknown'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(quote.status)}
            {quote.status === 'draft' && (
              <button
                onClick={() => handleStatusChange('sent')}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Send size={18} />
                Send to Customer
              </button>
            )}
            {quote.status === 'sent' && (
              <>
                <button
                  onClick={() => handleStatusChange('accepted')}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <CheckCircle size={18} />
                  Mark Accepted
                </button>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <XCircle size={18} />
                  Mark Rejected
                </button>
              </>
            )}
            {quote.status === 'draft' && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={18} />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quote Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Extinguisher Info */}
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Extinguisher Details</h2>
            {quote.extinguisher && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-500">Location</label>
                  <p className="font-medium">{quote.extinguisher.location}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Building</label>
                  <p className="font-medium">{quote.extinguisher.building}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Type</label>
                  <p className="font-medium">{quote.extinguisher.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Capacity</label>
                  <p className="font-medium">{quote.extinguisher.capacity || 'N/A'}</p>
                </div>
                {quote.extinguisher.serialNumber && (
                  <div>
                    <label className="text-sm text-gray-500">Serial Number</label>
                    <p className="font-medium">{quote.extinguisher.serialNumber}</p>
                  </div>
                )}
                {quote.extinguisher.manufacturer && (
                  <div>
                    <label className="text-sm text-gray-500">Manufacturer</label>
                    <p className="font-medium">{quote.extinguisher.manufacturer}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quote.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{line.description}</div>
                        {line.inventoryItem && (
                          <div className="text-sm text-gray-500">
                            {line.inventoryItem.partNumber}
                          </div>
                        )}
                        {line.isLabour && (
                          <span className="inline-block px-2 py-0.5 mt-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                            Labour
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">{line.quantity}</td>
                      <td className="px-4 py-3 text-right">£{line.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 font-medium text-right">£{line.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes and Terms */}
          {(quote.notes || quote.termsConditions) && (
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Additional Information</h2>
              {quote.notes && (
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-gray-600 whitespace-pre-wrap">{quote.notes}</p>
                </div>
              )}
              {quote.termsConditions && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Terms & Conditions</label>
                  <p className="text-gray-600 whitespace-pre-wrap">{quote.termsConditions}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Quote Info */}
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Quote Information</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-gray-500">Valid Until</label>
                  <p className="font-medium">{new Date(quote.validUntil).toLocaleDateString()}</p>
                </div>
                {quote.sentAt && (
                  <div>
                    <label className="text-gray-500">Sent Date</label>
                    <p className="font-medium">{new Date(quote.sentAt).toLocaleDateString()}</p>
                  </div>
                )}
                {quote.acceptedAt && (
                  <div>
                    <label className="text-gray-500">Accepted Date</label>
                    <p className="font-medium">{new Date(quote.acceptedAt).toLocaleDateString()}</p>
                  </div>
                )}
                {quote.rejectedAt && (
                  <div>
                    <label className="text-gray-500">Rejected Date</label>
                    <p className="font-medium">{new Date(quote.rejectedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">£{quote.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT ({quote.vatRate}%)</span>
                  <span className="font-medium">£{quote.vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-indigo-600">£{quote.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailPage;
