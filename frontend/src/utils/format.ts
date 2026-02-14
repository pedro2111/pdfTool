export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export const parseCurrency = (value: string): number => {
    // Remove non-numeric characters except for comma and minus sign
    // This is a simple parser, might be robust enough for basic inputs
    // Input example: "R$ 1.234,56" -> 1234.56
    const numericValue = value.replace(/[^\d,-]/g, '').replace(',', '.');
    return parseFloat(numericValue) || 0;
};
