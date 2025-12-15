import * as XLSX from 'xlsx';
import { Ad, REQUIRED_HEADERS, TEMPLATE_METADATA } from '../types';

/**
 * Generates the specific Facebook Marketplace XLSX structure.
 * Row 1: Template Title
 * Row 2: Instructions
 * Row 3: Headers
 * Row 4+: Data
 */
export const exportAdsToExcel = (ads: Ad[]): void => {
  // 1. Prepare the data array
  const dataRows = ads.map(ad => [
    ad.title,
    ad.price,
    ad.condition,
    ad.description,
    ad.category,
    ad.offer_shipping
  ]);

  // 2. Construct the full sheet data including metadata rows
  const worksheetData = [
    [TEMPLATE_METADATA.row1], // Row 1
    [TEMPLATE_METADATA.row2], // Row 2
    REQUIRED_HEADERS,         // Row 3
    ...dataRows               // Row 4+
  ];

  // 3. Create Sheet
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // 4. Create Workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Marketplace Ads");

  // 5. Download
  XLSX.writeFile(wb, "Facebook_Marketplace_Bulk_Ads.xlsx");
};

/**
 * Parses a user uploaded Excel file.
 * Logic tries to find the Header row. The chat log implies headers are on Row 3.
 */
export const parseExcelFile = async (file: File): Promise<Ad[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to array of arrays to inspect structure
        const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonSheet.length < 3) {
          throw new Error("File is too short. It must contain at least 3 rows (Title, Instructions, Headers).");
        }

        // Validate Headers (Row 3, index 2)
        const fileHeaders = jsonSheet[2] as string[];
        const cleanHeaders = fileHeaders.map(h => h?.trim()?.toLowerCase());
        
        // Basic validation checking if key columns exist
        const hasTitle = cleanHeaders.includes('title');
        const hasPrice = cleanHeaders.includes('price');

        if (!hasTitle || !hasPrice) {
          throw new Error("Invalid Template. Could not find 'Title' and 'Price' in Row 3.");
        }

        // Map data (starting at Row 4, index 3)
        const parsedAds: Ad[] = [];
        
        // Helper to find index case-insensitively
        const getIdx = (name: string) => cleanHeaders.indexOf(name.toLowerCase());

        for (let i = 3; i < jsonSheet.length; i++) {
          const row = jsonSheet[i];
          if (!row || row.length === 0) continue;

          parsedAds.push({
            id: crypto.randomUUID(),
            title: row[getIdx('title')] || '',
            price: Number(row[getIdx('price')]) || 0,
            condition: row[getIdx('condition')] || 'New',
            description: row[getIdx('description')] || '',
            category: row[getIdx('category')] || 'Home & Garden > Tools & Workshop Equipment', // Default fallback
            offer_shipping: row[getIdx('offer shipping')] || 'No'
          });
        }

        resolve(parsedAds);

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};