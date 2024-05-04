import { products } from '../../data/home-page.js';

/**
 * Formats prices to two decimal places with commas.
 * @param priceInCents - The price in cents.
 */
export function formatCurrency(priceInCents) {
    return (priceInCents / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/**
 * Finds a product in the 'products' array based on its ID.
 * @param {string} productId - The unique identifier of the product.
 * @returns {Object | undefined} - The matching product. If not found, undefined.
 */
export function findProductById(productId) {
    return products.find((product) => product.id === productId);
}

/**
 * Finds a product in the 'products' array based on its name.
 * @param {string} productName - The name of the product to find.
 * @returns {Object | undefined} - The matching product. If not found, undefined.
 */
export function findProductByName(productName) {
    return products.find((product) => product.name.toLowerCase() === productName);
}
