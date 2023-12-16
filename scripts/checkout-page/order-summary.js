import { formatCurrency } from '../utils/format-currency.js';
import { orders, updateOrdersInLocalStorage } from '../../data/orders-page.js';
import { generateOrderId, calculateOrderArrivalDate } from '../orders.js';
import {
    cart,
    calculateCartQuantity,
    calculateCartItemTotalCost,
    clearCart,
} from '../../data/checkout-page.js';

let promoCodeValidityFlag = false;
let orderTotalCost = 0;

function validatePromoCode(promoCode) {
    if (promoCode.toLowerCase() === 'demo') {
        document.querySelector('.valid-promo-code-message').style.display = 'block';
        document.querySelector('.invalid-promo-code-message').style.display = 'none';
        promoCodeValidityFlag = true;
    } else {
        document.querySelector('.valid-promo-code-message').style.display = 'none';
        document.querySelector('.invalid-promo-code-message').style.display = 'block';
        promoCodeValidityFlag = false;
    }

    document.querySelector('.promo-code-input').value = ''; // Clear the input field
    updateOrderSummaryDisplay();
}

document.querySelector('.apply-promo-code-button').addEventListener('click', () => {
    const promoCode = document.querySelector('.promo-code-input').value;
    if (promoCode.trim() !== '') {
        validatePromoCode(promoCode);
    }
});

/**
 * Updates the order summary display by calculating the quantity of cart items in cents,
 * shipping cost, total tax, and cart total after tax.
 */
export function updateOrderSummaryDisplay() {
    let itemsCost = calculateCartItemTotalCost();
    let shippingCost = 0;
    let discount = 0;

    if (itemsCost > 0 && itemsCost < 10000) {
        shippingCost = 899;
    }
    if (promoCodeValidityFlag) {
        discount = itemsCost * 0.15;
    }

    document.querySelector('.order-summary-items-cost').innerHTML = formatCurrency(itemsCost);
    document.querySelector('.order-summary-shipping-cost').innerHTML = formatCurrency(shippingCost);
    document.querySelector('.order-summary-discount').innerHTML = formatCurrency(discount);
    document.querySelector('.order-summary-tax-cost').innerHTML = formatCurrency(
        (itemsCost - discount + shippingCost) * 0.13
    );
    orderTotalCost = (itemsCost - discount + shippingCost) * 1.13;
    document.querySelector('.order-summary-total-cost').innerHTML = formatCurrency(orderTotalCost);
}

updateOrderSummaryDisplay();

function removePromoCode() {
    document.querySelector('.valid-promo-code-message').style.display = 'none';
    promoCodeValidityFlag = false;
    updateOrderSummaryDisplay();
}

document.querySelector('.remove-promo-code-button').addEventListener('click', () => {
    removePromoCode();
});

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

    // Add order to orders array
    orders.push({
        id: generateOrderId(),
        items: [...cart],
        price: orderTotalCost,
        orderDate: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        arrivalDate: `${calculateOrderArrivalDate(date, monthNames)}`,
    });

    clearCart();
    clearCart();
    updateOrdersInLocalStorage();

    // Set a flag in local storage to true for successful order placement
    localStorage.setItem('orderPlaced', 'true');
}

document.querySelector('.place-order-button').addEventListener('click', () => {
    setTimeout(() => {
        placeOrder();
        window.location.href = 'orders.html'; // Redirect user to the orders page
    }, 1000);
});

export function updatePlaceOrderButtonVisibility() {
    const placeOrderButton = document.querySelector('.place-order-button');

    if (calculateCartQuantity() > 0) {
        placeOrderButton.style.display = 'block';
    } else {
        placeOrderButton.style.display = 'none';
    }
}

updatePlaceOrderButtonVisibility();
