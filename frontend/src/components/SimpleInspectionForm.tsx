import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import type { Extinguisher } from '../types';
import { addExtinguisher } from '../lib/api';

type SimpleExtinguisherRow = {
  number: number;
  type: string;
  size: string;
  location: string;
  serviceType: string;
  nextDischargeTest: string;
  endOfLife: string;
  checked: boolean;
  // Store the full extinguisher data if editing existing
  existingData?: Extinguisher;
};

type Props = {
  onClose: () => void;
  onSave?: () => void;
  primaryColor?: string;
  siteId?: string;
  siteName?: string;
};

const EXTINGUISHER_TYPES = [
  'Water',
  'Foam',
  'CO2',
  'Dry Powder',
  'Dry Powder D Class',
  'Wet Chemical',
  'Fire Blanket',
  'Aqua Spray',
  'Lithium',
  'Zenova',
  'Lith Ex',
  'P50 Foam',
  'P50 Powder',
  'P50 Water Mist',
  'P50 Eco',
  'P50 F Class',
];

const SIZES = [
  '1KG',
  '2KG',
  '3KG',
  '4KG',
  '5KG',
  '6KG',
  '9KG',
  '2LTR',
  '3LTR',
  '6LTR',
  '9LTR',
];

const SERVICE_TYPES = [
  'BS',
  'CM',
  'Inspection',
  'Maintenance',
  'Extended Service',
  'Discharge Test',
  'Pressure Test',
];

const SimpleInspectionForm: React.FC<Props> = ({
  onClose,
  onSave,
  primaryColor = '#7c3aed',
  siteId,
  siteName,
}) => {
  const [rows, setRows] = useState<SimpleExtinguisherRow[]>([
    {
      number: 1,
      type: '',
      size: '',
      location: '',
      serviceType: 'BS',
      nextDischargeTest: '',
      endOfLife: '',
      checked: false,
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRow = () => {
    const nextNumber = Math.max(...rows.map(r => r.number)) + 1;
    setRows([
      ...rows,
      {
        number: nextNumber,
        type: '',
        size: '',
        location: '',
        serviceType: 'BS',
        nextDischargeTest: '',
        endOfLife: '',
        checked: false,
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (rows.length === 1) {
      setError('Must have at least one row');
      return;
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof SimpleExtinguisherRow, value: any) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleSave = async () => {
    setError(null);

    // Validate all rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.type) {
        setError(`Row ${i + 1}: Please select an extinguisher type`);
        return;
      }
      if (!row.size) {
        setError(`Row ${i + 1}: Please select a size`);
        return;
      }
      if (!row.location) {
        setError(`Row ${i + 1}: Please enter a location`);
        return;
      }
      if (!row.serviceType) {
        setError(`Row ${i + 1}: Please select a service type`);
        return;
      }
      if (!row.endOfLife) {
        setError(`Row ${i + 1}: Please enter end of life year`);
        return;
      }
    }

    try {
      setSaving(true);
      const today = new Date().toISOString().split('T')[0];

      for (const row of rows) {
        const payload: Partial<Extinguisher> = {
          type: row.type,
          capacity: row.size,
          location: row.location,
          building: siteName || row.location,
          serviceType: row.serviceType,
          status: 'Active',
          condition: row.checked ? 'Good' : 'Fair',
          lastInspection: today,
          expiryDate: `${row.endOfLife}-12-31`,
          ...(row.nextDischargeTest ? { nextMaintenance: row.nextDischargeTest } : {}),
          ...(siteId ? { siteId } : {}),
        };
        await addExtinguisher(payload);
      }

      onSave?.();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save inspection');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Simple Inspection Form</h3>
            {siteName && (
              <p className="text-sm text-gray-600">Site: {siteName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 border border-red-200 rounded bg-red-50">
              {error}
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Quick form for recording basic inspection data. Add extinguishers by number and mark them as checked.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type *
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size *
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location *
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service *
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Discharge Test
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Of Life *
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Checked
                  </th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, index) => (
                  <tr key={index} className={row.checked ? 'bg-green-50' : ''}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                        value={row.number}
                        onChange={(e) => updateRow(index, 'number', parseInt(e.target.value) || 1)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        value={row.type}
                        onChange={(e) => updateRow(index, 'type', e.target.value)}
                        aria-label="Extinguisher type"
                      >
                        <option value="">Select type...</option>
                        {EXTINGUISHER_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        value={row.size}
                        onChange={(e) => updateRow(index, 'size', e.target.value)}
                        aria-label="Extinguisher size"
                      >
                        <option value="">Select size...</option>
                        {SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        value={row.location}
                        onChange={(e) => updateRow(index, 'location', e.target.value)}
                        placeholder="e.g., Office, Workshop"
                        aria-label="Location"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        value={row.serviceType}
                        onChange={(e) => updateRow(index, 'serviceType', e.target.value)}
                        aria-label="Service type"
                      >
                        {SERVICE_TYPES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        value={row.nextDischargeTest}
                        onChange={(e) => updateRow(index, 'nextDischargeTest', e.target.value)}
                        aria-label="Next discharge test"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="2024"
                        max="2050"
                        className="w-24 px-2 py-1 border border-gray-300 rounded"
                        value={row.endOfLife}
                        onChange={(e) => updateRow(index, 'endOfLife', e.target.value)}
                        placeholder="2030"
                        aria-label="End of life year"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                        checked={row.checked}
                        onChange={(e) => updateRow(index, 'checked', e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeRow(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Remove row"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <button
            onClick={addRow}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Plus size={16} />
            Add Row
          </button>

          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Extinguishers:</span>
                <span className="ml-2 font-semibold text-blue-900">{rows.length}</span>
              </div>
              <div>
                <span className="text-blue-700">Checked:</span>
                <span className="ml-2 font-semibold text-blue-900">
                  {rows.filter(r => r.checked).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Inspection'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleInspectionForm;
