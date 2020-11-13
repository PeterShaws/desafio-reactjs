export const LOCALE = 'pt-BR';

const CURRENCY = 'BRL';

const formatValue = (value: number): string =>
  Intl.NumberFormat(LOCALE, { style: 'currency', currency: CURRENCY }).format(
    value,
  );

export default formatValue;
