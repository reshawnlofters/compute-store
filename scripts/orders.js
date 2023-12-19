import { products } from '../data/home-page.js';
import { formatCurrency } from './utils/format-currency.js';
import { orders, calculateOrderQuantity, updateOrdersInLocalStorage } from '../data/orders-page.js';
import { addProductToCart } from '../data/checkout-page.js';

const ordersGrid = document.querySelector('.orders-grid');

function generateOrdersHTML() {
    let ordersHTML = '';

    for (let i = orders.length - 1; i >= 0; i--) {
        const order = orders[i];

        ordersHTML += `
            <div class="order-container-${order.id}">
                <div class="order-header-container">
                    <div class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label label-primary">
                                Order Placed
                            </div>
                            <div>${order.date}, ${new Date().getFullYear()}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label label-primary">Total</div>
                            <div>${formatCurrency(order.price)}</div>
                        </div>
                    </div>

                    <div class="order-header-right-section">
                        <div class="order-header-label label-primary">Order ID</div>
                        <div>${order.id}</div>
                    </div>
                </div>
                ${generateOrderItemHTML(order)}
            </div>`;
    }

    if (ordersGrid) {
        ordersGrid.innerHTML = ordersHTML;
    }
}

/**
 * Generates HTML for displaying order items with conditional CSS styling based on positions.
 * Applies different styles to the first, last, and inner order items.
 * Also, includes a "Cancel Order" button using a flag.
 * @param order - The order object containing items to be displayed.
 * @returns The HTML representing the order items with applied styles.
 */
function generateOrderItemHTML(order) {
    let orderItemHTML = '';
    let isCancelOrderButtonGenerated = false;
    const numberOfOrderItems = order.items.length;

    order.items.forEach((orderItem, index) => {
        const matchingProduct = products.find((product) => product.id === orderItem.productId);
        let orderItemClass = 'inner-order-item-details-grid';

        // Check for the first order item
        if (index === 0) {
            orderItemClass = 'first-order-item-details-grid';
        }

        // Check for the last order item
        if (index === numberOfOrderItems - 1) {
            orderItemClass = 'last-order-item-details-grid';
        }

        const buyProductAgainButtonId = `buy-product-again-button-${order.id}-${orderItem.productId}`;

        // Check if the "Cancel Order" button has not been generated yet
        if (!isCancelOrderButtonGenerated) {
            orderItemHTML += `
                <div class="order-details-grid ${orderItemClass}">
                    <div class="product-image-container">
                        <img src="${matchingProduct.image}">
                    </div>

                    <div class="product-details">
                        <div class="product-name">
                            ${matchingProduct.name}
                        </div>
                        <div class="product-delivery-date">
                            Estimated Arrival: ${order.arrivalDate}, ${new Date().getFullYear()}
                        </div>
                        <div class="product-quantity">
                            Quantity: ${orderItem.quantity}
                        </div>
                        <button class="buy-product-again-button button-primary" id="${buyProductAgainButtonId}">
                            <i class="bi bi-arrow-clockwise"></i>
                            <span class="buy-again-message"
                                >Buy it again
                            </span>
                        </button>
                    </div>

                    <div class="product-actions">
                        <button
                            class="cancel-order-button button-primary"
                            data-order-id="${order.id}">
                                Cancel order
                        </button>
                    </div>
                </div>`;

            // Set the flag to indicate the button has been generated
            isCancelOrderButtonGenerated = true;
        } else {
            // If the button has already been generated, exclude it for subsequent items
            orderItemHTML += `
                <div class="order-details-grid ${orderItemClass}">
                    <div class="product-image-container">
                        <img src="${matchingProduct.image}">
                    </div>

                    <div class="product-details">
                        <div class="product-name">
                            ${matchingProduct.name}
                        </div>
                        <div class="product-delivery-date">
                            Estimated Arrival: ${order.arrivalDate}, ${new Date().getFullYear()}
                        </div>
                        <div class="product-quantity">
                            Quantity: ${orderItem.quantity}
                        </div>
                        <button class="buy-product-again-button button-primary" id="${buyProductAgainButtonId}">
                            <i class="bi bi-arrow-clockwise"></i>
                            <span class="buy-again-message"
                                >Buy it again
                            </span>
                        </button>
                    </div>
                </div>`;
        }
    });

    return orderItemHTML;
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
 * If there are orders, it generates the ordersHTML; otherwise, it generates
 * HTML for when there are no orders.
 */
function updateOrdersVisibility() {
    const orderQuantity = calculateOrderQuantity();
    orderQuantity > 0 ? generateOrdersHTML() : generateEmptyOrdersHTML();
}

updateOrdersVisibility();

export function generateOrderId() {
    let orderId = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

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
 * Calculates the estimated arrival date of an order based on the current date.
 * @param date - The 'Date' object representing the current date.
 * @param monthNames - An array of month names.
 * @returns a string that represents the estimated arrival date of an order.
 */
export function calculateOrderArrivalDate(date, monthNames) {
    const dayOfMonth = date.getDate();

    if (dayOfMonth + 2 >= 30) {
        const nextMonth = (date.getMonth() + 1) % 12;
        return `${monthNames[nextMonth]} 1`; // Arrives the first day of the next month
    } else {
        return `${monthNames[date.getMonth()]} ${dayOfMonth + 2}`; // Arrivals in two days
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
if (ordersGrid) {
    ordersGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('cancel-order-button')) {
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
 * Displays a modal to indicate an order was successfully placed.
 * A flag in local storage is checked to determine if the user is redirected to
 * the orders page after placing an order.
 */
function displayPlacedOrderModal() {
    const orderPlaced = localStorage.getItem('orderPlaced');

    if (orderPlaced === 'true') {
        const modal = document.querySelector('.placed-order-modal');
        modal.showModal();

        document.querySelector('.modal-close-window-button').addEventListener('click', () => {
            modal.close();
        });

        // Clear the flag in local storage
        localStorage.removeItem('orderPlaced');
    }
}

displayPlacedOrderModal();

function handleBuyProductAgainButtonClick(event) {
    const productDetailsContainer = event.target.closest('.product-details');

    if (productDetailsContainer) {
        const productNameElement = productDetailsContainer.querySelector('.product-name');
        const productName = productNameElement ? productNameElement.textContent.trim() : '';

        const matchingProduct = products.find((product) => product.name === productName);

        if (matchingProduct) {
            addProductToCart(matchingProduct.id, 1);
            navigateToCartPage();
        } else {
            console.error('Matching product not found.');
        }
    }
}

/**
 * Attaches a click event listener to the container for orders using event delegation.
 * If a "Buy Again" button is clicked, the corresponding product is added to the cart,
 * and the user is redirected to the cart page.
 */
if (ordersGrid) {
    ordersGrid.addEventListener('click', handleBuyProductAgainButtonClick);
}

function navigateToCartPage() {
    window.location.href = 'checkout.html';
}
