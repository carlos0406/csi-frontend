export const formatPriceInput = (
  value: string,
  onChange: (value: number) => void,
  inputElement: HTMLInputElement
) => {
  const digits = value.replace(/[^\d]/g, '');

  if (digits === '') {
    inputElement.value = '0,00';
    onChange(0);
    return;
  }

  const cents = parseInt(digits);
  const reais = cents / 100;

  const formatted = reais.toFixed(2).replace('.', ',');
  inputElement.value = formatted;

  onChange(reais);
};

export const formatQuantityInput = (
  value: string,
  onChange: (value: number) => void,
  inputElement: HTMLInputElement
) => {
  let cleanValue = value.replace(/\D/g, '');

  cleanValue = cleanValue.replace(/^0+/, '') || '0';

  if (cleanValue === '0') cleanValue = '';

  inputElement.value = cleanValue;

  onChange(parseInt(cleanValue) || 0);
};

export const isValidKey = (key: string, allowDecimal: boolean = false) => {
  const controlKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
  ];

  const numberKeys = /^[0-9]$/;
  const decimalKeys = allowDecimal ? /^[0-9,]$/ : numberKeys;

  return controlKeys.includes(key) || decimalKeys.test(key);
};
