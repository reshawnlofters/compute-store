/*
    Compute Store (E-commerce Store Simulator)

    Copyright © 2024 Reshawn Lofters

    This file is part of the Compute Store project, which is licensed under a Custom License.
    Please see the LICENSE file in the root of this project repository for full license details.
*/

import { findProductById, findProductByName, formatCurrency } from '../../shared/utils.js';
import {
    orders,
    calculateQuantityOfOrders,
    updateOrdersInLocalStorage
} from '../../../data/orders-page.js';
import { addProductToCart } from '../../../data/checkout-page.js';

const ordersGrid = document.querySelector('.orders-grid');

function generateOrdersHTML() {
    let ordersHTML = '';

    // Iterate through the orders in reverse order
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
                                Cancel
                        </div>
                    </section>
                </div>
                ${generateOrderItemHTML(order)}
            </div>`;
    }

    if (ordersGrid) {
        ordersGrid.innerHTML = ordersHTML;
    }
}

/**
 * Generates HTML for order items with conditional styling based on item positioning.
 * - Applies different styles to the first, inner, and last order items.
 * @param {Object} order - The order object containing the order items.
 * @returns {HTML} The HTML representing the order items with applied styles.
 */
function generateOrderItemHTML(order) {
    let orderItemHTML = '';
    const numberOfOrderItems = order.items.length;

    // Iterate through the order items
    order.items.forEach((orderItem, index) => {
        const matchingProduct = findProductById(orderItem.productId);
        let orderItemClass = 'inner-order-item-details-grid';

        // If the current order item is the first order item, set the corresponding styling
        if (index === 0) {
            orderItemClass = 'first-order-item-details-grid';
        }

        // If the current order item is the last order item, set the corresponding styling
        if (index === numberOfOrderItems - 1) {
            orderItemClass = 'last-order-item-details-grid';
        }

        orderItemHTML += `
            <div class="order-details-grid ${orderItemClass} product-container">
                <div class="product-image-container">
                    <img class="product-image" src="${matchingProduct.image}" alt="product image">
                </div>

                <div class="product-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-delivery-date">
                        Estimated delivery: ${formatOrderDeliveryDate(
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
                <i class="bi bi-bag-x" id="emptyOrdersContainerImg"></i>
            </div>`;
    }
}

/**
 * Updates the visibility of orders based on the quantity of orders.
 * - If there are orders, HTML for the orders is generated.
 * - If there are no orders, HTML for an empty orders list is generated.
 */
function updateOrdersVisibility() {
    const orderQuantity = calculateQuantityOfOrders();
    orderQuantity > 0 ? generateOrdersHTML() : generateEmptyOrdersHTML();
}

updateOrdersVisibility();

function formatOrderDeliveryDate(fullDate) {
    const date = new Date(fullDate);
    const options = { month: 'long', day: 'numeric' };

    return date.toLocaleDateString('en-US', options);
}

/**
 * Generates a random order ID consisting of alphanumeric characters.
 * @returns {string} The randomly generated order ID.
 */
export function generateOrderId() {
    let orderId = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Generate the first segment of the order ID
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderId += characters.charAt(randomIndex);
    }
    orderId += '-';

    // Generate the second segment of the order ID
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
 * Cancels an order and updates UI displays.
 * @param {string} orderId - The unique identifier of the order.
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
 * Handles the "cancel order" button click event.
 * - If the button is clicked, a modal appears for cancellation confirmation.
 */
function handleCancelOrderButtonClick(event) {
    const cancelOrderButton = event.target.closest('.cancel-order-button');

    if (!cancelOrderButton) {
        return;
    }

    const modal = document.querySelector('.cancel-order-modal');
    modal.showModal(); // Display the modal

    // If the "cancel order" button in the modal is clicked, cancel the order
    document.querySelector('.modal-cancel-order-button').addEventListener('click', () => {
        modal.close();
        const orderId = cancelOrderButton.dataset.orderId;

        setTimeout(() => {
            cancelOrder(orderId);
            updateOrdersVisibility();
        }, 500);
    });

    // If the "close" button in the modal is clicked, close the modal
    document.querySelector('.modal-close-button').addEventListener('click', () => {
        modal.close();
    });
}

if (ordersGrid) {
    ordersGrid.addEventListener('click', handleCancelOrderButtonClick);
}

/**
 * Displays a modal to indicate an order has been placed successfully.
 * - Checks a flag in local storage to determine if the user was sent from the checkout page.
 */
function displayPlacedOrderModal() {
    const isOrderPlaced = localStorage.getItem('isOrderPlaced');

    if (isOrderPlaced === 'true') {
        const modal = document.querySelector('.placed-order-modal');

        if (!modal) {
            console.error('Placed order modal not found.');
            return;
        }

        modal.showModal();

        // Add a click event listener to the "view order" button to close the modal
        document.querySelector('.modal-view-order-button').addEventListener('click', () => {
            modal.close();
        });

        // Remove the flag in local storage
        localStorage.removeItem('isOrderPlaced');
    }
}

displayPlacedOrderModal();

/**
 * Handles the "buy product again" button click event.
 * - If the button is clicked, the product is added to the cart and the user is sent to the checkout page.
 * @param {Event} event - The click event object.
 */
function handleBuyProductAgainButtonClick(event) {
    const buyAgainButton = event.target.closest('.buy-product-again-button');

    if (!buyAgainButton) {
        return;
    }

    const productDetailsContainer = buyAgainButton.closest('.product-details');
    const productNameElement = productDetailsContainer.querySelector('.product-name');
    const productName = productNameElement
        ? productNameElement.textContent.toLowerCase().trim()
        : '';
    const matchingProduct = findProductByName(productName);

    if (!matchingProduct) {
        console.error('Matching product not found.');
        return;
    }

    addProductToCart(matchingProduct.id, 1);
    navigateToCheckoutPage();
}

if (ordersGrid) {
    ordersGrid.addEventListener('click', handleBuyProductAgainButtonClick);
}

function navigateToCheckoutPage() {
    window.location.href = 'checkout.html';
}
