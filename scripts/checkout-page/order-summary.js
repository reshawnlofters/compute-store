import { formatCurrency } from '../utils/format-currency.js';
import { orders, updateOrdersInLocalStorage } from '../../data/orders-page.js';
import { generateOrderId, calculateOrderArrivalDate } from '../orders.js';
import {
    cart,
    calculateCartQuantity,
    calculateCartItemTotalCost,
    clearCart,
} from '../../data/checkout-page.js';

let isPromoCodeValid = false;
let orderTotal = 0;

/**
 * Validates a promotional code and updates the UI accordingly.
 * @param {string} promoCode - The promotional code to validate.
 */
function validatePromoCode(promoCode) {
    if (promoCode.toLowerCase() === 'demo') {
        document.querySelector('.valid-promo-code-message').style.display = 'block';
        document.querySelector('.invalid-promo-code-message').style.display = 'none';
        isPromoCodeValid = true;
    } else {
        document.querySelector('.valid-promo-code-message').style.display = 'none';
        document.querySelector('.invalid-promo-code-message').style.display = 'block';
        isPromoCodeValid = false;
    }

    document.querySelector('.promo-code-input').value = ''; // Clear input field
    updateOrderSummaryDisplay();
}

document.querySelector('.add-promo-code-button').addEventListener('click', () => {
    const promoCode = document.querySelector('.promo-code-input').value;
    if (promoCode.trim() !== '') {
        validatePromoCode(promoCode);
    }
});

/**
 * Updates the order summary display with calculations for subtotal,
 * shipping, discounts, taxes, and the overall total after tax.
 */
export function updateOrderSummaryDisplay() {
    const subtotal = calculateCartItemTotalCost();
    const shipping = subtotal > 0 && subtotal < 10000 ? 899 : 0;
    const discount = isPromoCodeValid ? subtotal * 0.15 : 0;

    // Apply discount color
    const discountColor = discount > 0 ? '#c9002e' : 'black';
    document.querySelector('.order-summary-discount').style.color = discountColor;

    // Update subtotal, shipping cost, discount, tax, and total cost
    document.querySelector('.order-summary-subtotal').innerHTML = formatCurrency(subtotal);

    // Display 'FREE' shipping if item cost exceeds $100
    document.querySelector('.order-summary-shipping').innerHTML =
        subtotal > 10000 ? 'FREE' : formatCurrency(shipping);

    document.querySelector('.order-summary-discount').innerHTML = `-${formatCurrency(discount)}`;
    document.querySelector('.order-summary-tax').innerHTML = formatCurrency(
        (subtotal - discount + shipping) * 0.13
    );

    orderTotal = (subtotal - discount + shipping) * 1.13;
    document.querySelector('.order-summary-total').innerHTML = formatCurrency(orderTotal);
}

updateOrderSummaryDisplay();

/**
 * Removes the applied promotional code and updates the order summary display.
 */
function removePromoCode() {
    document.querySelector('.valid-promo-code-message').style.display = 'none';
    isPromoCodeValid = false;
    updateOrderSummaryDisplay();
}

document.querySelector('.remove-promo-code-button').addEventListener('click', removePromoCode);

/**
 * Places an order, adds it to the orders array, and updates local storage.
 */
function placeOrder() {
    const date = new Date();
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    // Add order to orders array
    orders.push({
        id: generateOrderId(),
        items: [...cart],
        price: orderTotal,
        date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        arrivalDate: calculateOrderArrivalDate(date, monthNames),
    });

    clearCart();
    updateOrdersInLocalStorage();

    // Set a flag in local storage to indicate the order was placed
    localStorage.setItem('orderPlaced', 'true');
}

document.querySelector('.place-order-button').addEventListener('click', () => {
    placeOrder();
    navigateToOrdersPage();
});

function navigateToOrdersPage() {
    setTimeout(() => {
        window.location.href = 'orders.html';
    }, 500);
}

/**
 * Updates the visibility of the place order button based on the cart quantity.
 */
export function updatePlaceOrderButtonVisibility() {
    const placeOrderButton = document.querySelector('.place-order-button');
    const isCartNotEmpty = calculateCartQuantity() > 0;

    placeOrderButton.style.display = isCartNotEmpty ? 'block' : 'none';
}

updatePlaceOrderButtonVisibility();
