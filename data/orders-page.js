/*
    Compute Store (E-commerce Store Simulator)

    Copyright © 2024 Reshawn Lofters

    This file is part of the Compute Store project, which is licensed under a Custom License.
    Please see the LICENSE file in the root of this project repository for full license details.
*/

/**
 * Retrieves the `orders` data from local storage.
 * - If no data is found, an empty array is assigned to the variable.
 */
export let orders = JSON.parse(localStorage.getItem('orders')) || [];

/**
 * Updates the `orders` data in local storage.
 */
export function updateOrdersInLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * Calculates the total quantity of orders.
 * @returns {number} - The quantity of orders.
 */
export function calculateQuantityOfOrders() {
    return orders.length;
}

/**
 * Returns the `orders`array.
 */
export function getOrders() {
    return orders;
}