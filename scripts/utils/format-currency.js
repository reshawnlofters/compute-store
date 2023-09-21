/**
 * This function takes a price and returns it formatted with 2 decimal places.
 * @param priceInCents - The price in cents.
 */
export function formatCurrency(priceInCents) {
    return (priceInCents / 100).toFixed(2);
}
