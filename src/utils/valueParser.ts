/**
 * Parsed value result containing the numeric value and formatting symbols
 */
export interface ParsedValue {
  number: number;
  prefix: string;
  suffix: string;
  isNumeric: boolean;
}

/**
 * Parses a value to extract the numeric part and formatting symbols (prefixes and suffixes)
 *
 * @param val - The value to parse (number or string with formatting)
 * @returns ParsedValue containing the extracted number, prefix, suffix, and whether it's purely numeric
 *
 * @example
 * parseValue(42) // { number: 42, prefix: '', suffix: '', isNumeric: true }
 * parseValue('+5%') // { number: 5, prefix: '+', suffix: '%', isNumeric: false }
 * parseValue('-10€') // { number: 10, prefix: '-', suffix: '€', isNumeric: false }
 * parseValue('1,234.56') // { number: 1234.56, prefix: '', suffix: '', isNumeric: true }
 */
export function parseValue(val: string | number): ParsedValue {
  const stringValue = String(val);

  // If it's a pure number, return early
  if (typeof val === 'number' || !isNaN(Number(val))) {
    return { number: Number(val), prefix: '', suffix: '', isNumeric: true };
  }

  // Extract prefix (+ or -)
  const prefix = stringValue.match(/^[+-]/)?.[0] || '';

  // Extract suffix (%, €, $)
  const suffix = stringValue.match(/[%€$]$/)?.[0] || '';

  // Extract the numeric part
  const numberMatch = stringValue.match(/[+-]?[\d,\s]+\.?\d*/);
  const numberStr = numberMatch ? numberMatch[0].replace(/[,\s]/g, '') : '0';
  const number = parseFloat(numberStr) || 0;

  return { number: Math.abs(number), prefix, suffix, isNumeric: !prefix && !suffix };
}
