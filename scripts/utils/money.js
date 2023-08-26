// function to format product currency to 2 decimal places
export function formatCurrency(priceCents) {
    return (priceCents / 100).toFixed(2);
}