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
let orderTotal = 0;

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

document.querySelector('.add-promo-code-button').addEventListener('click', () => {
    const promoCode = document.querySelector('.promo-code-input').value;
    if (promoCode.trim() !== '') {
        validatePromoCode(promoCode);
    }
});

/**
 * Updates the order summary display with precise calculations for item costs,
 * shipping, discounts, taxes, and the overall total after tax.
 */
export function updateOrderSummaryDisplay() {
    const subtotal = calculateCartItemTotalCost();
    let shipping = 0;
    let discount = 0;

    // Apply shipping cost if applicable
    if (subtotal > 0 && subtotal < 10000) {
        shipping = 899;
    }

    // Apply discount for a valid promo code
    if (promoCodeValidityFlag) {
        discount = subtotal * 0.15;
    }
    if (discount > 0) {
        document.querySelector('.order-summary-discount').style.color = '#c9002e';
    }  else {
        document.querySelector('.order-summary-discount').style.color = 'black';
    }

    // Update item cost, shipping cost, discount, tax, and total cost
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
        price: orderTotal,
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
