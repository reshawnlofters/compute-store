import { products } from '../data/home-page.js';
import { formatCurrency } from './utils/format-currency.js';
import { orders, calculateOrderQuantity, updateOrdersInLocalStorage } from '../data/orders-page.js';

/**
 * Generates HTML for displaying orders.
 * Locates products in the 'products' array to access product details.
 */
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
                            <div class="order-header-label label-primary">
                                Order Placed
                            </div>
                            <div>${order.orderDate}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label label-primary">Total</div>
                            <div>$${formatCurrency(order.price)}</div>
                        </div>
                    </div>

                    <div class="order-header-right-section">
                        <div class="order-header-label label-primary">Order ID</div>
                        <div>${order.id}</div>
                    </div>
                </div>

                ${generateOrderItemsHTML(order)}
        </div>`;
    }

    const ordersGrid = document.querySelector('.orders-grid');
    if (ordersGrid) {
        ordersGrid.innerHTML = ordersHTML;
    }
}
generateOrdersHTML();

/**
 * Generates HTML for displaying order items with conditional CSS styling based on position.
 * Applies different styles to the first, last, and in-between items in an order.
 * Also includes a "Cancel Order" button for the first item using a flag.
 * @param {Object} order - The order object containing items to be displayed.
 * @returns {string} The HTML representing the order items with applied styles.
 */
function generateOrderItemsHTML(order) {
    let orderItemsHTML = '';
    let cancelOrderButtonGenerated = false;
    const numberOfItemsInOrder = order.items.length;

    order.items.forEach((orderItem, index) => {
        const productId = orderItem.productId;
        let matchingProduct;

        products.forEach((product) => {
            if (product.id === productId) {
                matchingProduct = product;
            }
        });

        let orderItemClass = 'in-between-order-item-details-grid';

        // check if this is the first order item
        if (index === 0) {
            orderItemClass = 'first-order-item-details-grid';
        }

        // check if this is the last order item
        if (index === numberOfItemsInOrder - 1) {
            orderItemClass = 'last-order-item-details-grid';
        }

        // check if the "Cancel Order" button has not been generated yet
        if (!cancelOrderButtonGenerated) {
            orderItemsHTML += `
                <div class="order-details-grid ${orderItemClass}">
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
                            <i class="bi bi-arrow-clockwise"></i>
                            <span class="buy-again-message"
                                >Buy it again
                            </span>
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

            // set the flag to indicate that the button has been generated
            cancelOrderButtonGenerated = true;
        } else {
            // if the button has already been generated, exclude it for subsequent items
            orderItemsHTML += `
                <div class="order-details-grid ${orderItemClass}">
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
                             <i class="bi bi-arrow-clockwise"></i>
                            <span class="buy-again-message">Buy it again
                            </span>
                        </button>
                    </div>
                </div>`;
        }
    });

    return orderItemsHTML;
}

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

/**
 * Updates the visibility of orders based on the quantity of orders.
 */
function updateOrdersVisibility() {
    if (calculateOrderQuantity() > 0) {
        generateOrdersHTML();
    } else {
        generateEmptyOrdersHTML();
    }
}
updateOrdersVisibility();

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
 * Calculates the arrival date of an order based on the current date.
 * @param date - The 'Date' object representing the current date.
 * @param monthNames - An array of month names.
 * @returns a string that represents the estimated arrival date of an order.
 */
export function calculateOrderArrivalDate(date, monthNames) {
    const dayOfMonth = date.getDate();

    if (dayOfMonth + 2 >= 30) {
        const nextMonth = (date.getMonth() + 1) % 12;

        // arrival date is the first day of the next month
        return `${monthNames[nextMonth]} 1`;
    } else {
        // arrival date is two days after the purchase date
        return `${monthNames[date.getMonth()]} ${dayOfMonth + 2}`;
    }
}

/**
 * Cancels an order using the 'orderId' and updates displays.
 * @param orderId - The unique identifier of the order to be cancelled.
 */
function cancelOrder(orderId) {
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);
        updateOrdersInLocalStorage();

        const orderItemContainer = document.querySelector(`.order-container-${orderId}`);
        orderItemContainer.remove();
    }
}

/**
 * Attaches a click event listener to the element that holds all "Cancel Order"
 * buttons using event delegation. If a button is clicked, a modal appears for the user
 * to confirm the cancellation.
 */
const ordersGrid = document.querySelector('.orders-grid');
if (ordersGrid) {
    document.querySelector('.orders-grid').addEventListener('click', (event) => {
        if (event.target.classList.contains('cancel-order-button')) {
            // get modal element
            const modal = document.querySelector('.cancel-order-modal');
            modal.showModal();

            document.querySelector('.modal-cancel-order-button').addEventListener('click', () => {
                modal.close();
                const orderId = event.target.dataset.orderId;

                cancelOrder(orderId);
                updateOrdersVisibility();
            });

            document.querySelector('.modal-close-button').addEventListener('click', () => {
                modal.close();
            });
        }
    });
}

/**
 * Displays a modal to signify an order was successfully placed.
 * A flag in local storage is checked to determine if the user is redirected to
 * the orders page after successfully placing an order.
 */
function displayPlacedOrderModal() {
    const orderPlaced = localStorage.getItem('orderPlaced');

    if (orderPlaced === 'true') {
        const modal = document.querySelector('.placed-order-modal');
        modal.showModal();

        document.querySelector('.modal-close-window-button').addEventListener('click', () => {
            modal.close();
        });

        // clear the flag
        localStorage.removeItem('orderPlaced');
    }
}
displayPlacedOrderModal();
