/**
 * Retrieve the 'orders' array from local storage.
 * If no value is found, assign an empty array to the variable.
 */
export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function updateOrdersInLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

export function calculateOrderQuantity() {
    return orders.length;
}
