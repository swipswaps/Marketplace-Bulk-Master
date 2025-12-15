import React, { useState, useEffect } from 'react';
import { Ad, CONDITION_OPTIONS, SHIPPING_OPTIONS, validateAd } from '../types';
import { Save, X, AlertCircle, MapPin, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

interface AdFormProps {
  initialData?: Ad | null;
  onSave: (ad: Ad) => void;
  onCancel: () => void;
}

const AdForm: React.FC<AdFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Ad>({
    id: '',
    title: '',
    price: 0,
    condition: 'New',
    description: '',
    category: 'Home & Garden > Tools & Workshop Equipment', // Default based on chat log
    offer_shipping: 'No'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(prev => ({ ...prev, id: crypto.randomUUID() }));
    }
  }, [initialData]);

  // Real-time validation on change
  useEffect(() => {
    const validationErrors = validateAd(formData);
    // Only show errors for touched fields to avoid overwhelming user initially
    const filteredErrors: Record<string, string> = {};
    Object.keys(validationErrors).forEach(key => {
      if (touched[key]) {
        filteredErrors[key] = validationErrors[key];
      }
    });
    setErrors(filteredErrors);
  }, [formData, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Run full validation on submit
    const validationErrors = validateAd(formData);
    if (Object.keys(validationErrors).length > 0) {
      setTouched({
        title: true,
        price: true,
        condition: true,
        category: true,
        description: true,
        offer_shipping: true
      });
      setErrors(validationErrors);
      return;
    }

    onSave(formData);
  };

  const isValid = Object.keys(validateAd(formData)).length === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Details will be formatted for the bulk upload template.</p>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 transition-shadow ${errors.title ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                placeholder="What are you selling?"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.title}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-md border pl-7 px-3 py-2 focus:outline-none focus:ring-2 transition-shadow ${errors.price ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.price}
                  </p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CONDITION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 transition-shadow ${errors.category ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                placeholder="e.g. Home & Garden > Tools"
              />
              <p className="text-xs text-gray-500 mt-1">Use the format: Category {'>'} Subcategory</p>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.category}
                </p>
              )}
            </div>

            {/* Offer Shipping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Shipping?</label>
              <select
                name="offer_shipping"
                value={formData.offer_shipping}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SHIPPING_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 transition-shadow font-mono text-sm ${errors.description ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                placeholder="Describe your item details, pickup location, etc."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.description}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                <Save size={16} />
                Save Ad
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Facebook Marketplace Preview
            </h3>
            
            {/* PREVIEW CARD */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-sm mx-auto">
              
              {/* Image Placeholder */}
              <div className="h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                <div className="bg-gray-200 p-4 rounded-full mb-2">
                  <Share2 size={24} className="text-gray-400" />
                </div>
                <span className="text-xs">No image in template</span>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold text-gray-900 leading-tight mb-1 break-words">
                    {formData.title || <span className="text-gray-300 italic">Title goes here</span>}
                  </h4>
                </div>
                
                <div className="mt-1 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ${formData.price?.toFixed(2) || '0.00'}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                   <span>{formData.category?.split('>').pop()?.trim() || 'Category'}</span>
                   <span>•</span>
                   <span>{formData.condition}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                   <div className="flex-1 bg-gray-100 text-center py-2 rounded-md font-medium text-gray-700 text-sm">
                      Message
                   </div>
                   <div className="p-2 bg-gray-100 rounded-md text-gray-700">
                      <Share2 size={18} />
                   </div>
                   <div className="p-2 bg-gray-100 rounded-md text-gray-700">
                      <MoreHorizontal size={18} />
                   </div>
                </div>

                {/* Seller Description Preview */}
                <div className="border-t pt-3">
                  <h5 className="text-sm font-semibold text-gray-900 mb-1">Description</h5>
                  <p className="text-sm text-gray-600 whitespace-pre-line break-words">
                    {formData.description ? (
                      formData.description.length > 150 
                        ? `${formData.description.substring(0, 150)}...` 
                        : formData.description
                    ) : (
                      <span className="text-gray-300 italic">Description text...</span>
                    )}
                  </p>
                  {formData.description && formData.description.length > 150 && (
                    <span className="text-sm font-medium text-gray-900 mt-1 inline-block">See more</span>
                  )}
                </div>

                <div className="border-t pt-3 mt-3">
                   <h5 className="text-sm font-semibold text-gray-900 mb-1">Seller Information</h5>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">YOU</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Your Name</div>
                        <div className="text-xs text-gray-500">Joined 2025</div>
                      </div>
                   </div>
                </div>

                {/* Location Mock */}
                 <div className="border-t pt-3 mt-3 flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin size={16} />
                    <span>Location hidden</span>
                 </div>

              </div>
            </div>

            {/* Validation Summary Box if errors exist */}
            {!isValid && Object.keys(touched).length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                <h4 className="text-xs font-bold text-red-800 uppercase mb-2">Missing Required Fields</h4>
                <ul className="text-xs text-red-700 list-disc list-inside space-y-1">
                  {Object.values(errors).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdForm;