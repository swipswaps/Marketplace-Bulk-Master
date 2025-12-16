export interface Ad {
  id: string;
  title: string;
  price: number;
  condition: string;
  description: string;
  category: string;
  offer_shipping: string; // 'Yes' or 'No'
  // Store any extra columns from the imported template that we don't edit explicitly
  other_fields?: Record<string, string | number | boolean>;
}

export type ExcelRow = (string | number | boolean | null | undefined)[];

export interface ParsedExcelData {
  ads: Ad[];
  headers: string[];
  metadata: ExcelRow[];
}

export interface ValidationErrors {
  [key: string]: string;
}

export type ViewState = 'list' | 'create' | 'edit';

export const CONDITION_OPTIONS = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];

export const SHIPPING_OPTIONS = ['Yes', 'No'];

// Default headers if no template is imported
// MUST be UPPERCASE to match Facebook's exact template format
export const REQUIRED_HEADERS = [
  'TITLE',
  'PRICE',
  'CONDITION',
  'DESCRIPTION',
  'CATEGORY',
  'OFFER SHIPPING',
];

export const TEMPLATE_METADATA = {
  row1: 'Facebook Marketplace Bulk Upload Template',
  row2: 'You can create up to 50 listings at once. When you are finished, be sure to save or export this as an XLS/XLSX file.',
};

/**
 * Validates an Ad object for required fields and data integrity.
 * Returns an object of error messages keyed by field name.
 */
export const validateAd = (ad: Ad): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!ad.title || ad.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (ad.title.length < 5) {
    errors.title = 'Title is too short (min 5 chars)';
  }

  if (ad.price === undefined || ad.price === null || isNaN(ad.price)) {
    errors.price = 'Price is required';
  } else if (ad.price < 0) {
    errors.price = 'Price cannot be negative';
  }

  if (!ad.category || ad.category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  if (!ad.description || ad.description.trim().length === 0) {
    errors.description = 'Description is required';
  }

  return errors;
};
