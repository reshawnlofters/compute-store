// initialize `orders` from local storage or use an empty array if no data is found.
export let orders = JSON.parse(localStorage.getItem('orders')) || [];

// This function saves the `orders` array to the browser's local storage as a JSON string
export function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}
