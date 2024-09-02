/*
    Compute Store (E-commerce Store Simulator)

    Copyright © 2024 Reshawn Lofters

    This file is part of the Compute Store project, which is licensed under a Custom License.
    Please see the LICENSE file in the root of this project repository for full license details.
*/

import { products } from '../../data/homepage.js';

export const date = new Date();
export const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

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
 * Finds a product in the `products` array based on its ID.
 * @param {string} productId - The unique identifier of the product.
 * @returns {Object | undefined} - The matching product. If not found, undefined.
 */
export function findProductById(productId) {
    return products.find((product) => product.id === productId);
}

/**
 * Finds a product in the `products` array based on its name.
 * @param {string} productName - The name of the product to find.
 * @returns {Object | undefined} - The matching product. If not found, undefined.
 */
export function findProductByName(productName) {
    return products.find((product) => product.name.toLowerCase() === productName);
}

/**
 * Clears the value of the specified input field.
 * @param {Element} inputElement - The input field to be cleared.
 */
export function clearInputField(inputElement) {
    inputElement.value = '';
}