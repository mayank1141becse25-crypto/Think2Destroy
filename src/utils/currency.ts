export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate: number; // exchange rate against USD (1 USD = X Currency)
  flag: string;
  country: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1.0,
    flag: '🇺🇸',
    country: 'United States',
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    rate: 86.5,
    flag: '🇮🇳',
    country: 'India',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.92,
    flag: '🇪🇺',
    country: 'Eurozone',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rate: 0.79,
    flag: '🇬🇧',
    country: 'United Kingdom',
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    rate: 1.38,
    flag: '🇨🇦',
    country: 'Canada',
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    rate: 1.54,
    flag: '🇦🇺',
    country: 'Australia',
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    rate: 155.0,
    flag: '🇯🇵',
    country: 'Japan',
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    rate: 3.67,
    flag: '🇦🇪',
    country: 'United Arab Emirates',
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    rate: 1.34,
    flag: '🇸🇬',
    country: 'Singapore',
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    rate: 5.6,
    flag: '🇧🇷',
    country: 'Brazil',
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R ',
    rate: 18.2,
    flag: '🇿🇦',
    country: 'South Africa',
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: 'Mex$',
    rate: 19.8,
    flag: '🇲🇽',
    country: 'Mexico',
  },
];

const STORAGE_KEY = 'w2w_selected_currency';

export const CurrencyService = {
  getSelectedCurrency(): CurrencyInfo {
    try {
      const savedCode = localStorage.getItem(STORAGE_KEY);
      if (savedCode) {
        const found = SUPPORTED_CURRENCIES.find((c) => c.code === savedCode);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return SUPPORTED_CURRENCIES[0]; // USD default
  },

  setSelectedCurrency(input: string | CurrencyInfo): CurrencyInfo {
    const code = typeof input === 'string' ? input : input?.code;
    const found = SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];
    try {
      localStorage.setItem(STORAGE_KEY, found.code);
    } catch {
      // ignore
    }
    return found;
  },

  /**
   * Converts a base USD amount into the target currency amount
   */
  convertFromUSD(usdAmount: number, currency: CurrencyInfo = SUPPORTED_CURRENCIES[0]): number {
    const curr = currency || SUPPORTED_CURRENCIES[0];
    return Number((usdAmount * curr.rate).toFixed(2));
  },

  /**
   * Formats a base USD amount into the user's localized currency string
   */
  formatUSD(usdAmount: number, currency: CurrencyInfo = SUPPORTED_CURRENCIES[0]): string {
    const curr = currency || SUPPORTED_CURRENCIES[0];
    const converted = this.convertFromUSD(usdAmount, curr);
    // For currencies like JPY with large numbers, omit fractional decimals if whole
    const decimals = curr.code === 'JPY' ? 0 : 2;
    return `${curr.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  },

  /**
   * Formats a pre-converted currency amount directly
   */
  formatRaw(amount: number, currency: CurrencyInfo = SUPPORTED_CURRENCIES[0]): string {
    const curr = currency || SUPPORTED_CURRENCIES[0];
    const decimals = curr.code === 'JPY' ? 0 : 2;
    return `${curr.symbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  },
};
