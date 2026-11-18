export type CurrencyCode = 'XAF' | 'USD' | 'EUR';

export interface CountryDialOption {
  name: string;
  isoCode: string;
  phonecode: string;
  maxLength: number;
  minLength: number;
}

export const COUNTRY_DIAL_OPTIONS: CountryDialOption[] = [
  { name: 'Cameroon', isoCode: 'CM', phonecode: '237', maxLength: 9, minLength: 9 },
  { name: 'France', isoCode: 'FR', phonecode: '33', maxLength: 9, minLength: 9 },
  { name: 'United Kingdom', isoCode: 'GB', phonecode: '44', maxLength: 10, minLength: 10 },
  { name: 'United States', isoCode: 'US', phonecode: '1', maxLength: 10, minLength: 10 },
  { name: 'Canada', isoCode: 'CA', phonecode: '1', maxLength: 10, minLength: 10 },
  { name: 'Nigeria', isoCode: 'NG', phonecode: '234', maxLength: 10, minLength: 10 },
  { name: 'Gabon', isoCode: 'GA', phonecode: '241', maxLength: 8, minLength: 7 },
  { name: 'Côte d’Ivoire', isoCode: 'CI', phonecode: '225', maxLength: 10, minLength: 10 },
  { name: 'Senegal', isoCode: 'SN', phonecode: '221', maxLength: 9, minLength: 9 },
  { name: 'Germany', isoCode: 'DE', phonecode: '49', maxLength: 11, minLength: 10 },
  { name: 'Switzerland', isoCode: 'CH', phonecode: '41', maxLength: 9, minLength: 9 },
  { name: 'United Arab Emirates', isoCode: 'AE', phonecode: '971', maxLength: 9, minLength: 9 },
  { name: 'India', isoCode: 'IN', phonecode: '91', maxLength: 10, minLength: 10 },
];

export const CAMEROON_REGIONS: { region: string; cities: string[]; deliveryDays: string; shippingFeeUsdMinor: number }[] = [
  { region: 'Littoral', cities: ['Douala', 'Edéa', 'Nkongsamba', 'Loum'], deliveryDays: '2–3 business days', shippingFeeUsdMinor: 600 },
  { region: 'Centre', cities: ['Yaoundé', 'Mbalmayo', 'Obala', 'Bafia'], deliveryDays: '2–3 business days', shippingFeeUsdMinor: 600 },
  { region: 'West', cities: ['Bafoussam', 'Dschang', 'Foumban', 'Mbouda', 'Bangangté'], deliveryDays: '3–5 business days', shippingFeeUsdMinor: 1000 },
  { region: 'South-West', cities: ['Buea', 'Limbe', 'Kumba', 'Tiko'], deliveryDays: '3–4 business days', shippingFeeUsdMinor: 900 },
  { region: 'North-West', cities: ['Bamenda', 'Kumbo', 'Wum'], deliveryDays: '4–6 business days', shippingFeeUsdMinor: 1200 },
  { region: 'South', cities: ['Kribi', 'Ebolowa', 'Sangmélima'], deliveryDays: '3–5 business days', shippingFeeUsdMinor: 1000 },
  { region: 'Adamawa', cities: ['Ngaoundéré', 'Meiganga', 'Tibati'], deliveryDays: '5–7 business days', shippingFeeUsdMinor: 1400 },
  { region: 'North', cities: ['Garoua', 'Guider', 'Figuil'], deliveryDays: '5–7 business days', shippingFeeUsdMinor: 1500 },
  { region: 'Far North', cities: ['Maroua', 'Kousséri', 'Mokolo'], deliveryDays: '6–8 business days', shippingFeeUsdMinor: 1600 },
  { region: 'East', cities: ['Bertoua', 'Batouri', 'Abong-Mbang'], deliveryDays: '5–7 business days', shippingFeeUsdMinor: 1400 },
];

export const CAMEROON_CITIES = CAMEROON_REGIONS.flatMap((r) => r.cities);

export const CAMEROON_CONTACT = {
  brandName: "Pomegranate 'n' Lime Cameroon",
  legalEntity: "Pomegranate 'n' Lime Cameroon SARL",
  email: 'bonjour@pomegranatenlime.cm',
  supportEmail: 'support@pomegranatenlime.cm',
  whatsappDisplay: '+237 6 77 48 29 10',
  whatsappDigits: '237677482910',
  doualaAtelier: 'Rue des Palmiers, Bonapriso, Douala, Cameroon',
  yaoundeSalon: 'Boulevard de l’URSS, Bastos, Yaoundé, Cameroon',
  taxId: 'NIU: M042618904211K · RC/DLA/2026/B/1408',
  freeShippingThresholdUsdMinor: 25000, // $250 = 150,000 FCFA
};

// Base catalog prices in catalog.json are in USD cents (minor units), e.g., 9900 = $99.00
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  XAF: 600, // 1 USD = 600 FCFA
  USD: 1,
  EUR: 0.92,
};

export function convertUsdMinorToDisplay(usdMinorUnit: number, currency: CurrencyCode): number {
  const usdMajor = usdMinorUnit / 100;
  if (currency === 'XAF') {
    // Round cleanly to nearest 500 FCFA for refined Cameroon retail pricing
    return Math.round((usdMajor * EXCHANGE_RATES.XAF) / 500) * 500;
  }
  return Math.round(usdMinorUnit * EXCHANGE_RATES[currency]);
}

export function formatMoney(usdMinorUnit: number, currency: CurrencyCode = 'XAF'): string {
  const val = convertUsdMinorToDisplay(usdMinorUnit, currency);
  if (currency === 'XAF') {
    return `${val.toLocaleString('en-US')} FCFA`;
  }
  if (currency === 'EUR') {
    return `€${(val / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  return `$${(val / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function getDialOptionByCountry(countryName?: string): CountryDialOption {
  return (
    COUNTRY_DIAL_OPTIONS.find((c) => c.name.toLowerCase() === (countryName || '').toLowerCase()) ||
    COUNTRY_DIAL_OPTIONS[0]
  );
}

export function detectCountryFromPhone(phone?: string): { country: string; localNumber: string } {
  if (!phone) return { country: 'Cameroon', localNumber: '' };
  const cleaned = phone.trim().replace(/[^\d+]/g, '');
  const digits = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
  const sorted = [...COUNTRY_DIAL_OPTIONS].sort((a, b) => b.phonecode.length - a.phonecode.length);
  for (const opt of sorted) {
    if (digits.startsWith(opt.phonecode)) {
      return { country: opt.name, localNumber: digits.slice(opt.phonecode.length) };
    }
  }
  return { country: 'Cameroon', localNumber: digits };
}

export function validatePhoneForCountry(countryName: string, localDigits: string): { isValid: boolean; error?: string } {
  const opt = getDialOptionByCountry(countryName);
  const digits = localDigits.replace(/\D/g, '');
  if (!digits) return { isValid: false, error: 'Phone number is required.' };
  if (digits.length < opt.minLength || digits.length > opt.maxLength) {
    return {
      isValid: false,
      error:
        opt.name === 'Cameroon'
          ? 'Please enter a valid 9-digit Cameroon mobile number (e.g. 677482910).'
          : `Please enter a valid ${opt.name} phone number (${opt.minLength}–${opt.maxLength} digits).`,
    };
  }
  if (opt.name === 'Cameroon' && !/^[26]\d{8}$/.test(digits)) {
    return { isValid: false, error: 'Cameroon numbers must start with 6 or 2 and have 9 digits.' };
  }
  return { isValid: true };
}

export function formatFullPhone(countryName: string, localDigits: string): string {
  const opt = getDialOptionByCountry(countryName);
  const digits = localDigits.replace(/\D/g, '');
  return digits ? `+${opt.phonecode} ${digits}` : '';
}

export function estimateDeliveryForAddress(region?: string, country?: string): { feeUsdMinor: number; label: string } {
  if (country && country.toLowerCase() !== 'cameroon') {
    return { feeUsdMinor: 4500, label: '7–14 business days (DHL Express International)' };
  }
  const found = CAMEROON_REGIONS.find((r) => r.region.toLowerCase() === (region || '').toLowerCase());
  if (found) {
    return { feeUsdMinor: found.shippingFeeUsdMinor, label: `${found.deliveryDays} (${found.region})` };
  }
  return { feeUsdMinor: 600, label: '2–3 business days (Douala & Yaoundé Courier)' };
}
