export interface Ad {
  id: string;
  title: string;
  price: number;
  condition: string;
  description: string;
  category: string;
  offer_shipping: string; // 'Yes' or 'No'
}

export type ViewState = 'list' | 'create' | 'edit';

export const CONDITION_OPTIONS = [
  'New',
  'Used - Like New',
  'Used - Good',
  'Used - Fair',
];

export const SHIPPING_OPTIONS = ['Yes', 'No'];

// Based on the chat log analysis of the required template
export const REQUIRED_HEADERS = [
  'Title',
  'Price',
  'Condition',
  'Description',
  'Category',
  'Offer Shipping'
];

export const TEMPLATE_METADATA = {
  row1: "Facebook Marketplace Bulk Upload Template",
  row2: "Instructions: Fill in the details below. Do not change the header row. Price should be a number. Shipping must be Yes or No."
};

/**
 * Validates an Ad object for required fields and data integrity.
 * Returns an object of error messages keyed by field name.
 */
export const validateAd = (ad: Ad): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!ad.title || ad.title.trim().length === 0) {
    errors.title = "Title is required";
  } else if (ad.title.length < 5) {
    errors.title = "Title is too short (min 5 chars)";
  }

  if (ad.price === undefined || ad.price === null || isNaN(ad.price)) {
    errors.price = "Price is required";
  } else if (ad.price < 0) {
    errors.price = "Price cannot be negative";
  }

  if (!ad.category || ad.category.trim().length === 0) {
    errors.category = "Category is required";
  }

  if (!ad.description || ad.description.trim().length === 0) {
    errors.description = "Description is required";
  }

  return errors;
};