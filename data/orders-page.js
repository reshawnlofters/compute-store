/**
 * Retrieves the 'orders' array from local storage.
 * If no value is found, assign an empty array to the variable.
 */
export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function updateOrdersInLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * Calculates the quantity of orders in the 'orders' array.
 * @returns {number} - The number of orders.
 */
export function calculateQuantityOfOrders() {
    return orders.length;
}
