import { formatCurrency } from '../utils/format-currency.js';
import { orders, updateOrdersInLocalStorage } from '../../data/orders-page.js';
import { generateOrderId, calculateOrderArrivalDate } from '../orders.js';
import {
    cart,
    calculateCartQuantity,
    calculateCartItemTotalCost,
    clearCart,
} from '../../data/checkout-page.js';

/**
 * Updates the order summary display by calculating the quantity of cart items,
 * shipping cost, total tax, and cart total after tax.
 */
export function updatePaymentSummaryDisplay() {
    let cartItemTotalCostInCents = calculateCartItemTotalCost();
    let shippingHandlingFeeInCents = cartItemTotalCostInCents === 0 ? 0 : 499;
    let cartTotalBeforeTaxInCents = cartItemTotalCostInCents + shippingHandlingFeeInCents;

    document.querySelector('.js-order-summary-items-cost').innerHTML = `$${formatCurrency(
        cartItemTotalCostInCents
    )}`;

    document.querySelector('.js-order-summary-shipping-cost').innerHTML = `$${formatCurrency(
        shippingHandlingFeeInCents
    )}`;

    document.querySelector('.js-order-summary-tax-cost').innerHTML = `$${formatCurrency(
        cartTotalBeforeTaxInCents * 0.13
    )}`;

    document.querySelector('.js-order-summary-total-cost').innerHTML = `$${formatCurrency(
        cartTotalBeforeTaxInCents * 1.13
    )}`;
}
updatePaymentSummaryDisplay();

function placeOrder() {
    let date = new Date();
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

    // add order to orders array
    orders.push({
        id: generateOrderId(),
        items: [...cart],
        priceInCents: (calculateCartItemTotalCost() + 999) * 1.13,
        orderDate: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        arrivalDate: `${calculateOrderArrivalDate(date, monthNames)}`,
    });

    clearCart();
    clearCart();
    updateOrdersInLocalStorage();

    // set a flag in local storage to signify successful order placement
    localStorage.setItem('orderPlaced', 'true');
}

/**
 * Attaches a click event listener to the "Place Order" button. If the button is clicked,
 * the order is placed and the user is redirected to the orders page.
 */
document.querySelector('.place-order-button').addEventListener('click', () => {
    setTimeout(() => {
        placeOrder();
        window.location.href = 'orders.html';
    }, 1000);
});

/**
 * Updates the visibility of the "Place Order" button based on the quantity of cart items.
 */
export function updatePlaceOrderButtonVisibility() {
    const placeOrderButton = document.querySelector('.place-order-button');

    if (calculateCartQuantity() > 0) {
        placeOrderButton.style.display = 'block';
    } else {
        placeOrderButton.style.display = 'none';
    }
}
updatePlaceOrderButtonVisibility();
