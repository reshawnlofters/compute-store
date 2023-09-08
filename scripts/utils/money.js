/**
 * The function takes a price in cents and returns it formatted with 2 decimal places.
 * @param priceInCents - The parameter `priceInCents` represents the price in cents.
 */
export function formatCurrency(priceInCents) {
    return (priceInCents / 100).toFixed(2);
}