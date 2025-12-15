import React from 'react';
import { Ad, validateAd } from '../types';
import { Edit2, Trash2, Package, AlertCircle } from 'lucide-react';

interface AdListProps {
  ads: Ad[];
  onEdit: (ad: Ad) => void;
  onDelete: (id: string) => void;
}

const AdList: React.FC<AdListProps> = ({ ads, onEdit, onDelete }) => {
  if (ads.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-blue-500" size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No ads yet</h3>
        <p className="text-gray-500 mt-1">Import a template or create your first ad manually.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ads.map((ad) => {
              const errors = validateAd(ad);
              const isValid = Object.keys(errors).length === 0;

              return (
                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-center w-16">
                     {isValid ? (
                       <span className="w-2 h-2 rounded-full bg-green-500 block mx-auto" title="Valid"></span>
                     ) : (
                       <div className="group relative flex justify-center">
                         <AlertCircle size={18} className="text-red-500 cursor-help" />
                         <div className="absolute left-6 top-0 z-10 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Missing: {Object.keys(errors).join(', ')}
                         </div>
                       </div>
                     )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{ad.description.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${ad.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {ad.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(ad)}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(ad.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex justify-between">
        <span>Showing {ads.length} ads</span>
        <span>Ready for Bulk Export</span>
      </div>
    </div>
  );
};

export default AdList;