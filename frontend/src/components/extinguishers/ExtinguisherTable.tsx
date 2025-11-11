import React from 'react';
import type { Extinguisher } from '../../../../src/api/components/types';

type Props = {
  items: Extinguisher[];
  onView: (item: Extinguisher) => void;
};

const ExtinguisherTable: React.FC<Props> = ({ items, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((ext) => (
              <tr key={ext.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{ext.location}</td>
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
              <tr><td className="px-6 py-8 text-sm text-gray-500" colSpan={4}>No extinguishers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExtinguisherTable;
