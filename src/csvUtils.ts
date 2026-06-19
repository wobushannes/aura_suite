import { Customer } from './types';

/**
 * Serializes customer records to standard RFC-4180 CSV format.
 * Automatically wraps values containing quotes, commas, semicolons, or newlines.
 */
export function exportCustomersToCSV(customers: Customer[]): string {
  const headers = [
    'id',
    'name',
    'company',
    'email',
    'phone',
    'address',
    'status',
    'username',
    'passwordHash',
    'notes',
    'createdAt',
    'approved'
  ];

  const escapeValue = (val: any): string => {
    if (val === undefined || val === null) return '';
    const str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes(';') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = [
    headers.join(','),
    ...customers.map(cust =>
      [
        escapeValue(cust.id),
        escapeValue(cust.name),
        escapeValue(cust.company),
        escapeValue(cust.email),
        escapeValue(cust.phone),
        escapeValue(cust.address),
        escapeValue(cust.status),
        escapeValue(cust.username),
        escapeValue(cust.passwordHash),
        escapeValue(cust.notes),
        escapeValue(cust.createdAt),
        escapeValue(cust.approved !== false ? 'true' : 'false')
      ].join(',')
    )
  ];

  return rows.join('\r\n');
}

/**
 * Parses a CSV string backing support for commas and semicolons.
 * Correctly respects quoted values with internal commas, semicolons, and escaped quotes.
 */
export function parseCustomersFromCSV(csvText: string): Partial<Customer>[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\n' || (char === '\r' && csvText[i + 1] !== '\n')) {
        lines.push(currentLine);
        currentLine = '';
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length === 0) return [];

  // Detect delimiter (comma or semicolon)
  const firstLine = lines[0];
  let delimiter = ',';
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  if (semicolonCount > commaCount) {
    delimiter = ';';
  }

  // Parse header
  const headers = parseCSVLine(firstLine, delimiter).map(h => h.trim().toLowerCase());
  const parsedCustomers: Partial<Customer>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(lines[i], delimiter);
    const customer: any = {};

    headers.forEach((header, index) => {
      let val = values[index] || '';
      if (header === 'approved') {
        customer.approved = val.toLowerCase() === 'true';
      } else {
        customer[header] = val;
      }
    });

    if (customer.name || customer.company) {
      if (!customer.id) {
        customer.id = 'import_' + Math.random().toString(36).substring(2, 11);
      }
      if (!customer.status) {
        customer.status = 'Aktiv';
      }
      if (customer.approved === undefined) {
        customer.approved = true;
      }
      if (!customer.createdAt) {
        customer.createdAt = new Date().toISOString();
      }
      parsedCustomers.push(customer);
    }
  }

  return parsedCustomers;
}

/**
 * Parses a single CSV line into its token elements according to RFC-4180.
 */
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        currentValue += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  result.push(currentValue);
  return result;
}
