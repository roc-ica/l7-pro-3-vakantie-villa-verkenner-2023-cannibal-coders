export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('nl-NL').format(date);
};
