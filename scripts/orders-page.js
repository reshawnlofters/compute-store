import { products } from '../data/products.js';
import {
    calculateOrderQuantity,
    orders,
    saveToLocalStorage,
} from '../data/orders.js';
import { formatCurrency } from './utils/format-currency.js';

/* This function generates the HTML for each order in the `orders` array. It iterates 
through each order and concatenates the generated HTML to the `ordersHTML` variable.*/
function generateOrdersHTML() {
    let ordersHTML = '';

    for (let i = orders.length - 1; i >= 0; i--) {
        const order = orders[i];
        const productId = order.productId;
        let matchingProduct;

        products.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        ordersHTML += `
            <div class="order-container-${order.id}">
                <div class="order-header">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label">
                                Order Placed:
                            </div>
                            <div>${order.orderDate}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label">Total:</div>
                            <div>$${formatCurrency(order.priceInCents)}</div>
                        </div>
                    </div>

                    <div class="order-header-right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${order.id}</div>
                    </div>
                </div>

                <!-- call the function to generate the order items HTML -->
                ${generateOrderItemsHTML(order)}
        </div>`;
    }

    // display the orders on the page
    const ordersGrid = document.querySelector('.orders-grid');
    if (ordersGrid) {
        ordersGrid.innerHTML = ordersHTML;
    }
}

// This function generates the HTML for order items
function generateOrderItemsHTML(order) {
    let orderItemsHTML = '';

    order.items.forEach((orderItem) => {
        // find and assign the matching product to access product details
        const productId = orderItem.productId;
        let matchingProduct;

        products.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        orderItemsHTML += `
            <div class="order-details-grid">
                <div class="product-image-container">
                   <img src="${matchingProduct.image}">
                </div>

                <div class="product-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-delivery-date">
                        Arriving on: ${order.arrivalDate}
                    </div>
                    <div class="product-quantity">
                        Quantity: ${orderItem.quantity}
                    </div>
                    <button class="buy-again-button button-primary">
                        <img
                            class="buy-again-icon"
                            src="images/icons/buy-again.png"
                        />
                        <span class="buy-again-message"
                            >Buy it again</span
                        >
                    </button>
                </div>

                <div class="product-actions">
                        <button
                            class="cancel-order-button button-secondary"
                            data-order-id="${order.id}">
                                Cancel order
                        </button>
                </div>
            </div>`;
    });

    return orderItemsHTML;
}

generateOrdersHTML();

// This function generates the HTML for when there are no orders
function generateEmptyOrdersHTML() {
    const ordersGrid = document.querySelector('.orders-grid');

    if (ordersGrid) {
        ordersGrid.innerHTML = `
            <div class="empty-orders-container">
                <div class="empty-orders-message-container">
                    <div>
                        <span>Looks like it's empty!</span><br><br>
                        Why not place an order?
                    </div>
                    <div>
                        Continue shopping on the
                        <a class="link-primary" href="index.html">homepage</a>.
                    </div>
                </div>
                <img class="empty-orders-container-img" src="images/icons/shopping-bag.png">
            </div>`;
    }
}

// This function updates order visibility based on the quantity of orders
function updateOrdersVisibility() {
    if (calculateOrderQuantity() > 0) {
        generateOrdersHTML();
    } else {
        generateEmptyOrdersHTML();
    }
}

updateOrdersVisibility();

/**
 * This function generates a random order ID.
 * @returns the generated order ID.
 */
export function generateOrderId() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let orderId = '';

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderId += characters.charAt(randomIndex);
    }

    orderId += '-';

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            orderId += characters.charAt(randomIndex);
        }
        if (i < 3) {
            orderId += '-';
        }
    }

    return orderId;
}

/**
 * This function calculates the arrival date of an order based on the current date.
 * @param date - The `Date` object representing the current date.
 * @param monthNames - An array of month names.
 * @returns a string that represents the estimated arrival date of an order.
 */
export function calculateOrderArrivalDate(date, monthNames) {
    const dayOfMonth = date.getDate();

    if (dayOfMonth + 2 >= 30) {
        // calculate the next month
        const nextMonth = (date.getMonth() + 1) % 12;

        // display the first day of the next month
        return `${monthNames[nextMonth]} 1`;
    } else {
        // display 2 days after the day of the month (2 day shipping)
        return `${monthNames[date.getMonth()]} ${dayOfMonth + 2}`;
    }
}

/**
 * This function cancels an order based on the `orderId`, updates the orders array,
 * and syncs the changes with the page.
 * @param orderId - The unique identifier of the order to be cancelled.
 */
function cancelOrder(orderId) {
    // find the index of the order with the specified ID
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    // if the order is found, remove it from the orders array
    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);
        saveToLocalStorage();

        // remove the order from the page
        const orderItemContainer = document.querySelector(
            `.order-container-${orderId}`
        );
        orderItemContainer.remove();
    }
}

/**
 * This code attaches a click event listener to the container that holds all "Cancel Order"
 * buttons. It uses event delegation to handle the click events for the buttons.
 * If a button is clicked, a modal appears and the user is prompted to confirm the cancellation.
 * */
const ordersGrid = document.querySelector('.orders-grid');
if (ordersGrid) {
    document
        .querySelector('.orders-grid')
        .addEventListener('click', (event) => {
            if (event.target.classList.contains('cancel-order-button')) {
                // get modal element
                const modal = document.querySelector('.cancel-order-modal');
                modal.showModal();

                document
                    .querySelector('.modal-cancel-order-button')
                    .addEventListener('click', () => {
                        modal.close();

                        // get the order ID from the data attribute
                        const orderId = event.target.dataset.orderId;

                        cancelOrder(orderId);
                        updateOrdersVisibility();
                    });

                document
                    .querySelector('.modal-not-now-button')
                    .addEventListener('click', () => {
                        modal.close();
                    });
            }
        });
}
