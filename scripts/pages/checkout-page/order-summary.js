import { formatCurrency } from '../../shared/format-currency.js';
import { orders, updateOrdersInLocalStorage } from '../../../data/orders-page.js';
import { generateOrderId } from '../orders-page/orders-page.js';
import {
    cart,
    calculateQuantityOfCartItems,
    calculateCartItemTotalCost,
    clearCart,
} from '../../../data/checkout-page.js';

let isPromoCodeValid = false;
let orderTotal = 0;

function validatePromoCode() {
    const promoCodeInput = document.querySelector('.promo-code-input');
    const promoCode = promoCodeInput.value.trim();
    const validMessage = document.querySelector('.valid-promo-code-message');
    const invalidMessage = document.querySelector('.invalid-promo-code-message');

    if (promoCode == '') {
        invalidMessage.textContent = 'Promotion code is required';
        invalidMessage.style.display = 'block';
        validMessage.style.display = 'none';
    } else if (promoCode.toLowerCase() !== 'demo') {
        invalidMessage.textContent = 'Promotion code is invalid';
        invalidMessage.style.display = 'block';
        validMessage.style.display = 'none';
        isPromoCodeValid = false;
    } else {
        validMessage.style.display = 'block';
        invalidMessage.style.display = 'none';
        isPromoCodeValid = true;
    }

    promoCodeInput.value = '';
    updateOrderSummaryDisplay();
}

document.querySelector('.add-promo-code-button').addEventListener('click', validatePromoCode);

/**
 * Updates the order summary display with calculations for subtotal,
 * discounts, shipping, taxes, and the total cost.
 */
export function updateOrderSummaryDisplay() {
    const subtotal = calculateCartItemTotalCost();
    const shipping = subtotal > 0 && subtotal < 10000 ? 899 : 0;
    const discount = isPromoCodeValid ? subtotal * 0.25 : 0;

    // Apply discount color
    const discountColor = discount > 0 ? '#c9002e' : 'black';
    document.querySelector('.order-summary-discount').style.color = discountColor;

    // Update subtotal, discount, shipping cost, tax, and total cost
    document.querySelector('.order-summary-subtotal').innerHTML = formatCurrency(subtotal);

    // Display 'FREE' shipping if subtotal exceeds $100
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
 * Removes applied promotional codes and updates displays.
 */
function removePromoCode() {
    document.querySelector('.valid-promo-code-message').style.display = 'none';
    isPromoCodeValid = false;
    updateOrderSummaryDisplay();
}

document.querySelector('.remove-promo-code-button').addEventListener('click', removePromoCode);

function placeOrder() {
    const selectedCartItemDeliveryDates = getSelectedCartItemDeliveryDates();
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
    const order = {
        id: generateOrderId(),
        items: cart.map((cartItem, index) => ({
            ...cartItem,
            deliveryDate: selectedCartItemDeliveryDates[index],
        })),
        price: orderTotal,
        date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
    };

    orders.push(order);

    clearCart();
    updateOrdersInLocalStorage();

    // Set a flag in local storage to indicate the order was placed
    localStorage.setItem('orderPlaced', 'true');
}

function getSelectedCartItemDeliveryDates() {
    const selectedCartItemDeliveryDates = [];
    document.querySelectorAll('.delivery-option-input:checked').forEach((radioButton) => {
        const dateElement = radioButton
            .closest('.delivery-option')
            .querySelector('.delivery-date-option');
        selectedCartItemDeliveryDates.push(dateElement.textContent.trim());
    });
    return selectedCartItemDeliveryDates;
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
    const isCartNotEmpty = calculateQuantityOfCartItems() > 0;

    placeOrderButton.style.display = isCartNotEmpty ? 'block' : 'none';
}

updatePlaceOrderButtonVisibility();
