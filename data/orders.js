// initialize `orders` from local storage or use an empty array if no data is found
export let orders = JSON.parse(localStorage.getItem('orders')) || [];

// This function saves the `orders` array to local storage
export function saveOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * This function calculates the quantity of orders.
 * @returns the quantity of orders.
 */
export function calculateOrderQuantity() {
    return orders.length;
}
