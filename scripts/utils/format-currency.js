/**
 * Formats prices to two decimal places.
 * @param priceInCents - The price in cents.
 */
export function formatCurrency(priceInCents) {
    return (priceInCents / 100).toFixed(2);
}
