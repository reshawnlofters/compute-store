/*
    Compute Store (E-commerce Store Simulator)

    Copyright © 2024 Reshawn Lofters

    This file is part of the Compute Store project, which is licensed under a Custom License.
    Please see the LICENSE file in the root of this project repository for full license details.
*/

import { formatCurrency, date, monthNames, clearInputField } from '../../shared/utils.js';
import { orders, updateOrdersInLocalStorage } from '../../../data/orders-page.js';
import { generateOrderId } from '../orders-page/orders-page.js';
import {
    cart,
    calculateQuantityOfCartItems,
    calculateCartItemTotalCost,
    clearCart
} from '../../../data/checkout-page.js';

const promoCodeInput = document.querySelector('.promo-code-input');
const validPromoCodeMessageElement = document.querySelector('.valid-promo-code-message');
const invalidPromoCodeMessageElement = document.querySelector('.invalid-promo-code-message');
const addPromoCodeButton = document.querySelector('.add-promo-code-button');
const removePromoCodeButton = document.querySelector('.remove-promo-code-button');
const placeOrderButton = document.querySelector('.place-order-button');

let isValidPromoCode = false;
let orderTotal = 0;

/**
 * Validates a promo code inputted by the user and updates UI displays.
 */
function validatePromoCode() {
    const promoCodeInput = document.querySelector('.promo-code-input');
    const promoCode = promoCodeInput.value.trim();

    if (!promoCodeInput || !validPromoCodeMessageElement || !invalidPromoCodeMessageElement) {
        console.error('Promo code elements not found.');
        return;
    }

    if (promoCode === '') {
        invalidPromoCodeMessageElement.textContent = 'Promotion code is required';
        invalidPromoCodeMessageElement.style.display = 'block';
        validPromoCodeMessageElement.style.display = 'none';
    } else if (promoCode.toLowerCase() !== 'save20') {
        invalidPromoCodeMessageElement.textContent = 'Promotion code is not recognized';
        invalidPromoCodeMessageElement.style.display = 'block';
        validPromoCodeMessageElement.style.display = 'none';
        isValidPromoCode = false;
    } else {
        validPromoCodeMessageElement.style.display = 'block';
        invalidPromoCodeMessageElement.style.display = 'none';
        isValidPromoCode = true;
    }

    clearInputField(promoCodeInput);
    updateOrderSummaryDisplay();
}

if (addPromoCodeButton) {
    addPromoCodeButton.addEventListener('click', validatePromoCode);
}

/**
 * Handles adding a promo code using the "enter" key.
 * - If the key is pressed, the promo code is validated.
 */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && promoCodeInput.value.trim() !== '') {
        validatePromoCode();
    }
})

/**
 * Updates the order summary display with calculated values.
 * Calculates an order subtotal, shipping cost, discounts, taxes, and total cost.
 */
export function updateOrderSummaryDisplay() {
    const subtotal = calculateCartItemTotalCost();
    const shippingCost = subtotal > 0 && subtotal < 10000 ? 899 : 0;
    const discountSavings = isValidPromoCode ? subtotal * 0.25 : 0; // Discount is 20%
    const taxes = (subtotal - discountSavings + shippingCost) * 0.13;

    // Calculate the order total
    orderTotal = subtotal - discountSavings + shippingCost + taxes;

    updateOrderSummaryElement('.order-summary-subtotal', formatCurrency(subtotal));
    updateOrderSummaryElement('.order-summary-shipping', formatShippingCost(subtotal, shippingCost));
    updateOrderSummaryDiscountElement('.order-summary-discount', discountSavings);
    updateOrderSummaryElement('.order-summary-tax', formatCurrency(taxes));
    updateOrderSummaryElement('.order-summary-total', formatCurrency(orderTotal));
}

updateOrderSummaryDisplay();

/**
 * Updates an order summary element with a calculated value.
 * @param {string} selector - The selector of the element.
 * @param {string} value - The calculated value to be displayed in the element.
 */
function updateOrderSummaryElement(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
        element.innerHTML = value;
    }
}

/**
 * Updates the order summary 'discount' element with a calculated value.
 * @param {string} selector - The selector of the element.
 * @param {number} discountSavings - The amount of discount savings.
 */
function updateOrderSummaryDiscountElement(selector, discountSavings) {
    const discountElement = document.querySelector(selector);
    const discountElementColor = discountSavings > 0 ? '#c9002e' : 'black';

    if (discountElement) {
        discountElement.style.color = discountElementColor;
        discountElement.innerHTML =
            discountSavings > 0 ? `- ${formatCurrency(discountSavings)} (20%)` : formatCurrency(discountSavings);
    }
}

/**
 * Formats the shipping cost in the order summary based on the order subtotal.
 * - If the subtotal is greater than $100, shipping is free.
 * @param {number} subtotal - The order subtotal.
 * @param {number} shipping - The order shipping cost.
 * @returns {string|number} - The formatted shipping cost. If shipping is free, returns 'FREE'.
 */
function formatShippingCost(subtotal, shipping) {
    return subtotal > 10000 ? 'FREE' : formatCurrency(shipping);
}

/**
 * Removes applied promo codes and updates order summary display.
 */
function removePromoCode() {
    if (validPromoCodeMessageElement) {
        validPromoCodeMessageElement.style.display = 'none';
        isValidPromoCode = false;

        updateOrderSummaryDisplay();
    } else {
        console.error('Valid promo code message element not found.');
    }
}

if (removePromoCodeButton) {
    removePromoCodeButton.addEventListener('click', removePromoCode);
}

/**
 * Handles the process of placing an order.
 * Creates an order object with items from the cart.
 * Clears the cart after the order is placed and updates the 'orders' data in local storage.
 */
function placeOrder() {
    const selectedCartItemDeliveryDates = getSelectedCartItemDeliveryDates();

    // Create order object
    const order = {
        id: generateOrderId(),
        items: cart.map((cartItem, index) => ({
            ...cartItem,
            deliveryDate: selectedCartItemDeliveryDates[index],
        })),
        price: orderTotal,
        date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
    };

    // Add order to 'orders' array
    orders.push(order);

    clearCart();
    updateOrdersInLocalStorage();

    // Set a flag in local storage to indicate the order was placed
    localStorage.setItem('isOrderPlaced', 'true');
}

if (placeOrderButton) {
    placeOrderButton.addEventListener('click', () => {
        placeOrder();
        navigateToOrdersPage(); // Send the user to the orders page
    });
}

/**
 * Retrieves the selected delivery dates for cart items.
 * Finds all checked delivery option inputs and extracts the corresponding delivery dates.
 * @returns {string[]} - An array containing the selected delivery dates for cart items.
 */
function getSelectedCartItemDeliveryDates() {
    const selectedCartItemDeliveryDates = [];

    document.querySelectorAll('.delivery-option-input:checked').forEach((radioButton) => {
        const dateElement = radioButton
            .closest('.delivery-option')
            .querySelector('.delivery-date-option');

        // Add the selected cart item delivery date to the array
        selectedCartItemDeliveryDates.push(dateElement.textContent.trim());
    });

    return selectedCartItemDeliveryDates;
}

function navigateToOrdersPage() {
    setTimeout(() => {
        window.location.href = 'orders.html';
    }, 500);
}

/**
 * Updates the visibility of the "place order" button based on the quantity of cart items.
 */
export function updatePlaceOrderButtonVisibility() {
    const isCartEmpty = calculateQuantityOfCartItems() < 0;

    if (placeOrderButton) {
        placeOrderButton.style.display = isCartEmpty ? 'none' : 'block';
    }
}

updatePlaceOrderButtonVisibility();
