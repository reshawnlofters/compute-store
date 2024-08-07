/*
    Compute Store (E-commerce Store Simulator)

    Copyright © 2024 Reshawn Lofters

    This file is part of the Compute Store project, which is licensed under a Custom License.
    Please see the LICENSE file in the root of this project repository for full license details.
*/

/**
 * Array of products.
 * Each product object contains the product ID, image URL, name, and price.
 */
export const products = [
    {
        id: '6b07d4e7-f540-454e-8a1e-363f25dbae7d',
        image: 'images/products/laptops/apple-macbook-air-silver.png',
        name: 'Apple Macbook Air - Silver',
        priceInCents: 174900,
    },
    {
        id: 'd37a651a-d501-483b-aae6-a9659b0757a0',
        image: 'images/products/laptops/apple-macbook-air-space-grey.png',
        name: 'Apple Macbook Air - Space Grey',
        priceInCents: 174900,
    },
    {
        id: '0d7f9afa-2efe-4fd9-b0fd-ba5663e0a524',
        image: 'images/products/laptops/apple-macbook-air-starlight.png',
        name: 'Apple Macbook Air - Starlight',
        priceInCents: 174900,
    },
    {
        id: '02e3a47e-dd68-467e-9f71-8bf6f723fdae',
        image: 'images/products/laptops/apple-macbook-air-midnight.png',
        name: 'Apple Macbook Air - Midnight',
        priceInCents: 174900,
    },
    {
        id: '77919bbe-0e56-475b-adde-4f24dfed3a04',
        image: 'images/products/phones/apple-iphone-15-pro-max-blue-titanium.png',
        name: 'Apple iPhone 15 Pro Max - Blue Titanium',
        priceInCents: 174900,
    },
    {
        id: 'dd82ca78-a18b-4e2a-9250-31e67412f98d',
        image: 'images/products/phones/apple-iphone-15-pro-max-natural-titanium.png',
        name: 'Apple iPhone 15 Pro Max - Natural Titanium',
        priceInCents: 174900,
    },
    {
        id: '3fdfe8d6-9a15-4979-b459-585b0d0545b9',
        image: 'images/products/phones/apple-iphone-15-pro-max-white-titanium.png',
        name: 'Apple iPhone 15 Pro Max - White Titanium',
        priceInCents: 174900,
    },
    {
        id: '54e0eccd-8f36-462b-b68a-8182611d9add',
        image: 'images/products/accessories/apple-airtag.webp',
        name: 'Apple AirTag',
        priceInCents: 3900,
    },
    {
        id: 'c2a82c5e-aff4-435f-9975-517cfaba2ece',
        image: 'images/products/mouses/logitech-mx-master-3s-graphite.png',
        name: 'Logitech MX Master 3S - Graphite',
        priceInCents: 13999,
    },
    {
        id: '82bb68d7-ebc9-476a-989c-c78a40ee5cd9',
        image: 'images/products/mouses/logitech-mx-master-3s-white.png',
        name: 'Logitech MX Master 3S - White',
        priceInCents: 13999,
    },
    {
        id: '04701903-bc79-49c6-bc11-1af7e3651358',
        image: 'images/products/mouses/apple-magic-mouse-black.png',
        name: 'Apple Magic Mouse - White',
        priceInCents: 8900,
    },
    {
        id: '901eb2ca-386d-432e-82f0-6fb1ee7bf969',
        image: 'images/products/mouses/apple-magic-mouse-white.png',
        name: 'Apple Magic Mouse - White',
        priceInCents: 8900,
    },
    {
        id: '2a82c5e-aff4-435f-9975-517cfabeic85',
        image: 'images/products/headphones/beats-studio-buds-black.png',
        name: 'Beats Studio Buds - Black',
        priceInCents: 18995,
    },
    {
        id: '0cje85e-aff4-435f-9975-517cfaba2ece',
        image: 'images/products/headphones/beats-studio-buds-white.png',
        name: 'Beats Studio Buds - White',
        priceInCents: 18995,
    },
    {
        id: '903049ca-386d-432e-82f0-6fbccuwbf969',
        image: 'images/products/headphones/beats-studio-buds-red.png',
        name: 'Beats Studio Buds - Red',
        priceInCents: 18995,
    },
    {
        id: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
        image: 'images/products/ipads/apple-ipad-pro.png',
        name: 'Apple iPad Pro 12.9 inch (6th generation) - Space Grey',
        priceInCents: 149900,
    },
    {
        id: '2a82c5e-aff4-9dnr-9975-51opcyba2ece',
        image: 'images/products/headphones/beats-studio-pro-black.png',
        name: 'Beats Studio Pro Headphones - Black',
        priceInCents: 46995,
    },
    {
        id: '15oerzyf-327a-4ec4-896f-486349e85a3d',
        image: 'images/products/headphones/beats-studio-pro-sandstone.png',
        name: 'Beats Studio Pro Headphones - Sandstone',
        priceInCents: 46995,
    },
    {
        id: '15b6fc6f-339a-4df4-896f-486349e85a3d',
        image: 'images/products/headphones/beats-studio-pro-navy.png',
        name: 'Beats Studio Pro Headphones - Navy',
        priceInCents: 46995,
    },
    {
        id: '1ocun56f-327a-4ec4-896f-48635ie85a3d',
        image: 'images/products/headphones/beats-studio-pro-deep-brown.png',
        name: 'Beats Studio Pro Headphones - Deep Brown',
        priceInCents: 46995,
    },
    {
        id: '5968897c-4d27-0938-89f6-5bc3952746d7',
        image: 'images/products/headphones/apple-airpods-max-space-grey.png',
        name: 'AirPods Max - Space Grey',
        priceInCents: 77900,
    },
    {
        id: '3fdfe8d6-0927-4979-b459-585b0d0545b9',
        image: 'images/products/headphones/apple-airpods-max-silver.png',
        name: 'AirPods Max - Silver',
        priceInCents: 77900,
    },
    {
        id: '183947d6-9a15-4979-b459-585b0d0545b9',
        image: 'images/products/headphones/apple-airpods-max-green.png',
        name: 'AirPods Max - Green',
        priceInCents: 77900,
    },
    {
        id: '3fdfe8d6-9a15-9837-b459-585b0d0545b9',
        image: 'images/products/headphones/apple-airpods-max-sky-blue.png',
        name: 'AirPods Max - Sky Blue',
        priceInCents: 77900,
    },
    {
        id: '8c0952b5-5a19-74cb-23d1-150926487c53',
        image: 'images/products/headphones/apple-airpods-pro.png',
        name: 'AirPods Pro (2nd generation) with MagSafe Charging Case',
        priceInCents: 32900,
    },
    {
        id: '8c0952b5-5a19-74cb-23d1-158a74287c53',
        image: 'images/products/headphones/apple-airpods-generation-3.png',
        name: 'AirPods (3rd generation) with MagSafe Charging Case',
        priceInCents: 23900,
    },
    {
        id: '8c9c52b5-5a19-4bcb-a5d1-158a74287c53',
        image: 'images/products/accessories/apple-pencil.png',
        name: 'Apple Pencil (2nd generation)',
        priceInCents: 16900,
    },
    {
        id: '3fdfe8d6-9a15-4979-b459-585b0d009837',
        image: 'images/products/accessories/apple-240w-usb-c-charge-cable.png',
        name: '240W USB-C Charge Cable (2m)',
        priceInCents: 3900,
    },
    // {
    //     id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    //     image: 'images/products/keyboards/logitech-mx-keys-s-graphite.png',
    //     name: 'Logitech MX Keys S Keyboard - Graphite',
    //     priceInCents: 14999,
    // },
    // {
    //     id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    //     image: 'images/products/keyboards/logitech-mx-keys-s-pale-grey.png',
    //     name: 'Logitech MX Keys S Keyboard - Pale grey',
    //     priceInCents: 14999,
    // },
    // {
    //     id: 'aad29d11-ea98-41ee-9285-b916638cac4a',
    //     image: 'images/products/keyboards/apple-magic-keyboard-black.png',
    //     name: 'Apple Magic Keyboard - Black',
    //     priceInCents: 22900,
    // },
    // {
    //     id: '5968897c-4d27-4872-89f6-5bcb052746d7',
    //     image: 'images/products/keyboards/apple-magic-keyboard-white.png',
    //     name: 'Apple Magic Keyboard - White',
    //     priceInCents: 22900,
    // }
];
