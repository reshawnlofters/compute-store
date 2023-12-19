/**
 * Retrieve the 'orders' array from local storage.
 * If no value is found, assign an empty array to the variable.
 */
export let orders = JSON.parse(localStorage.getItem('orders')) || [];

/**
 * Update the 'orders' array in local storage with the current content.
 */
export function updateOrdersInLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * Calculate and return the quantity of orders in the 'orders' array.
 * @returns {number} - The number of orders.
 */
export function calculateOrderQuantity() {
    return orders.length;
}
