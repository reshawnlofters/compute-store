import { addProductToCart, getCart } from "../../data/checkout-page";
import { getOrders } from "../../data/orders-page";
import { cancelOrder, generateOrderId } from "../../scripts/pages/orders-page/orders-page";

/**
 * Tests if the `cancelOrder` function cancels an order.
 * - Uses the ID of a product from the `products` array for testing.
 * - Sets up a mock DOM element to simulate an existing `order-container` 
 *   because Jest runs in a Node.js environment where DOM methods are not available by default.
 */
test('cancels an order', () => {
    let productId = '6b07d4e7-f540-454e-8a1e-363f25dbae7d';
    let productQuantity = 1;

    addProductToCart(productId, productQuantity);

    // Create order object
    const cart = getCart();
    const orderId = generateOrderId();
    const order = {
        id: orderId,
        items: cart.map((cartItem) => ({
            ...cartItem,
            deliverDate: '',
        })),
        price: 0,
        date: '',
    };

    // Place order
    const orders = getOrders();
    orders.push(order);

    // Set up a mock DOM element to simulate an existing `order-container` for the `cancelOrder` function
    document.body.innerHTML =
        `<div class="order-container-${'6b07d4e7-f540-454e-8a1e-363f25dbae7d'}"></div>`;

    // Mock the `document.querySelector` method to return the mock element
    const mockRemoveFunction = jest.fn(); // Create a mock function to track `remove` method calls
    jest.spyOn(document, 'querySelector').mockReturnValue({
        remove: mockRemoveFunction, // Mock `remove` method on the returned element
    });

    cancelOrder(orderId);

    // Check if the order has been removed from the `orders` array
    const orderInOrders = orders.find((orderItem) => orderItem.id === orderId);
    expect(orderInOrders).toBeUndefined();

    // Verify that `document.querySelector` was called with the correct selector
    expect(document.querySelector).toHaveBeenCalledWith(`.order-container-${orderId}`);

    // Verify that the remove method was called on the mocked DOM element
    expect(mockRemoveFunction).toHaveBeenCalled();
});
