import { findProductById, findProductByName, formatCurrency } from '../../shared/utils.js';
import {
    orders,
    calculateQuantityOfOrders,
    updateOrdersInLocalStorage,
} from '../../../data/orders-page.js';
import { addProductToCart } from '../../../data/checkout-page.js';

const ordersGrid = document.querySelector('.orders-grid');

function generateOrdersHTML() {
    let ordersHTML = '';

    for (let i = orders.length - 1; i >= 0; i--) {
        const order = orders[i];

        ordersHTML += `
            <div class="order-container order-container-${order.id}">
                <div class="order-header-container">
                    <section class="order-header-left-section">
                        <div class="order-date">
                            <div class="order-header-label label-primary">
                                Order Date
                            </div>
                            <div>${order.date}, ${new Date().getFullYear()}</div>
                        </div>
                        <div class="order-total">
                            <div class="order-header-label label-primary">Total</div>
                            <div>${formatCurrency(order.price)}</div>
                        </div>
                        <div class="order-id">
                            <div class="order-header-label label-primary">Order ID</div>
                            <div>${order.id}</div>
                        </div>
                    </section>
                    <section class="order-header-right-section">
                        <div
                            class="cancel-order-button link-primary"
                            data-order-id="${order.id}">
                                Cancel order
                        </div>
                    </section>
                </div>
                ${generateOrderItemHTML(order)}
            </div>`;
    }

    if (ordersGrid) ordersGrid.innerHTML = ordersHTML;
}

/**
 * Generates order item HTML with conditional CSS styling based on item positions.
 * Applies different styles to the first, inner, and last order items.
 * @param {object} order - The order object containing items to be displayed.
 * @returns {HTML} The HTML representing the order items with applied styles.
 */
function generateOrderItemHTML(order) {
    let orderItemHTML = '';
    const numberOfOrderItems = order.items.length;

    order.items.forEach((orderItem, index) => {
        const matchingProduct = findProductById(orderItem.productId);
        let orderItemClass = 'inner-order-item-details-grid';

        // Check if current order item is the first
        if (index === 0) {
            orderItemClass = 'first-order-item-details-grid';
        }

        // Check if current order item is the last
        if (index === numberOfOrderItems - 1) {
            orderItemClass = 'last-order-item-details-grid';
        }

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
                        Estimated delivery: ${formatDeliveryDate(
                            orderItem.deliveryDate
                        )}, ${new Date().getFullYear()}
                    </div>
                    <div class="product-quantity">
                        Quantity: ${orderItem.quantity}
                    </div>
                    <button class="buy-product-again-button button-primary">
                        <i class="bi bi-arrow-clockwise"></i>
                        <span
                            >Buy it again
                        </span>
                    </button>
                </div>
            </div>`;
    });

    return orderItemHTML;
}

function generateEmptyOrdersHTML() {
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
 * If there are orders, it generates the orders HTML; otherwise, it generates
 * HTML for when there are no orders.
 */
function updateOrdersVisibility() {
    const orderQuantity = calculateQuantityOfOrders();
    orderQuantity > 0 ? generateOrdersHTML() : generateEmptyOrdersHTML();
}

updateOrdersVisibility();

function formatDeliveryDate(fullDate) {
    const dateObject = new Date(fullDate);
    const options = { month: 'long', day: 'numeric' };
    return dateObject.toLocaleDateString('en-US', options);
}

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
        if (i < 3) orderId += '-';
    }

    return orderId;
}

/**
 * Removed an order from the 'orders' array and updates displays.
 * @param {string} orderId - The unique identifier of the order to be cancelled.
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
 * Adds a click event listener to "Cancel Order" buttons container.
 * If the button is clicked, a modal appears for the user to confirm the order cancellation.
 */
if (ordersGrid) {
    ordersGrid.addEventListener('click', (event) => {
        const cancelOrderButton = event.target.closest('.cancel-order-button');

        if (cancelOrderButton) {
            const modal = document.querySelector('.cancel-order-modal');

            modal.showModal();

            // If the inner cancel order button is clicked, cancel the order
            document.querySelector('.modal-cancel-order-button').addEventListener('click', () => {
                modal.close();
                const orderId = cancelOrderButton.dataset.orderId;

                setTimeout(() => {
                    cancelOrder(orderId);
                    updateOrdersVisibility();
                }, 500);
            });

            // If the inner close button is clicked, close the modal
            document.querySelector('.modal-close-button').addEventListener('click', () => {
                modal.close();
            });
        }
    });
}

/**
 * Displays a modal to indicate a successfully placed order.
 * Checks a flag in local storage to determine if the user has been
 * redirected to the orders page after successfully placing an order.
 */
function displayPlacedOrderModal() {
    const isOrderPlaced = localStorage.getItem('isOrderPlaced');

    if (isOrderPlaced === 'true') {
        const modal = document.querySelector('.placed-order-modal');

        if (modal) {
            modal.showModal();

            // Add an event listener to the "View Order" button
            document.querySelector('.modal-view-order-button').addEventListener('click', () => {
                modal.close();
            });
        }

        // Clear the flag in local storage
        localStorage.removeItem('isOrderPlaced');
    }
}

displayPlacedOrderModal();

/**
 * Handles the "Buy Again" button click event.
 * If the button is clicked, the corresponding product is added to the cart,
 * and the user is redirected to the checkout page.
 * @param {Event} event - The click event.
 */
function handleBuyProductAgainButtonClick(event) {
    const buyAgainButton = event.target.closest('.buy-product-again-button');

    if (buyAgainButton) {
        const productDetailsContainer = buyAgainButton.closest('.product-details');
        const productNameElement = productDetailsContainer.querySelector('.product-name');
        const productName = productNameElement
            ? productNameElement.textContent.toLowerCase().trim()
            : '';
        const matchingProduct = findProductByName(productName);

        if (matchingProduct) {
            addProductToCart(matchingProduct.id, 1);
            navigateToCartPage();
        } else {
            console.error('Matching product not found.');
        }
    }
}

if (ordersGrid) ordersGrid.addEventListener('click', handleBuyProductAgainButtonClick);

function navigateToCartPage() {
    window.location.href = 'checkout.html';
}
