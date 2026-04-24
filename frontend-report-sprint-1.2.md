# Sprint 1.2 Frontend Report

## Objective
Isolate product data into a separate file and upgrade the cart experience to feel more premium and polished.

## What Was Changed

### 1. Data extraction
- Created [data.js](data.js) to hold the `products` catalog separately from the main application logic.
- Updated [index.html](index.html) and [products.html](products.html) to load `data.js` before `script.js`.
- Updated [panier.html](panier.html) to load `data.js` before `script.js` as well, so cart rendering can resolve product data consistently.

### 2. Cart refactor in JavaScript
- Refactored [script.js](script.js) so the app now reads products from the external data file instead of defining them inline.
- Added helper utilities for:
  - formatting currency labels
  - finding a product by id
  - saving cart and favorites state to `localStorage`
  - showing toast messages
  - animating the cart icon after an add-to-cart action
- Implemented full cart behavior in script:
  - add to cart
  - update quantity with `+` and `-`
  - remove item from cart
  - toggle favorites
  - checkout feedback

### 3. Cart UI redesign
- Replaced the simple cart list in [panier.html](panier.html) with a Bootstrap table layout.
- The cart table now shows:
  - product thumbnail
  - product name
  - unit price
  - quantity controls
  - line total
- Added a dedicated order summary panel with:
  - subtotal
  - shipping fees fixed at `7DT`
  - free shipping shown as `Offert` when subtotal is above `100DT`
  - final total
- Added an empty-cart state so the page looks intentional when there are no items.

### 4. Visual polish
- Updated [style.css](style.css) with a more premium visual direction:
  - imported expressive fonts
  - added a soft background gradient
  - created a luxury-style cart panel and summary card
  - styled the table, thumbnails, quantity controls, and empty state
  - added a vibration animation for the cart icon
- Improved navbar presentation across the pages with a consistent light Bootstrap navbar.

### 5. Product page cleanup
- Removed a duplicated heading in [products.html](products.html).
- Added Bootstrap Icons support where needed for the cart and UI icons.

## Current Frontend State

### Working now
- Product data is separated into [data.js](data.js).
- The homepage and product listing page both load catalog data correctly.
- The cart page renders a structured Bootstrap table instead of a simple vertical list.
- Cart totals are calculated dynamically.
- Shipping is computed as `7DT` or `Offert` depending on subtotal.
- The cart badge count updates from `localStorage`.
- Adding a product triggers a short vibration animation on the cart icon.
- Favorites and cart state persist in the browser via `localStorage`.

### Present UI structure
- `index.html`: hero, featured products, about section, and premium navigation.
- `products.html`: filtered/sorted catalog view with cart access in the navbar.
- `panier.html`: two-column layout with cart table on the left and order summary on the right.

## Validation
- Syntax checks returned no errors for:
  - [script.js](script.js)
  - [data.js](data.js)
  - [index.html](index.html)
  - [products.html](products.html)
  - [panier.html](panier.html)
  - [style.css](style.css)

## Notes
- The project is now in a cleaner structure for future API replacement because the product data is isolated in one file.
- The cart experience is more aligned with a premium storefront layout.

## Sprint 2.2 Add-on: Checkout Validation & Security

### 1. Checkout form replacement
- Replaced the simple payment button in [panier.html](panier.html) with a professional checkout form.
- The form only appears when the cart contains items.
- Added the following fields:
  - full name
  - Tunisian phone number with 8 digits
  - governorate selector with all 24 Tunisian governorates
  - precise address

### 2. Real-time validation in JavaScript
- Extended [script.js](script.js) with live form validation.
- The submit button stays disabled until all fields are valid.
- Error messages appear under each field when validation fails.
- Validation rules currently include:
  - phone number must contain exactly 8 digits
  - name must be a plausible full name
  - governorate must be selected
  - address must contain enough detail

### 3. Order object generation
- Updated `checkout()` so it now builds an `orderData` JSON object.
- The object includes:
  - customer details
  - cart items
  - subtotal
  - shipping cost
  - final total
  - order date
- For now, the order is logged with `console.log(orderData)` before redirecting.

### 4. Confirmation flow
- Added [confirmation.html](confirmation.html) as a success page after checkout.
- The confirmation page reads the saved order from `sessionStorage`.
- It displays:
  - success message
  - customer summary
  - order totals
  - purchased items

### 5. Styling updates for checkout
- Extended [style.css](style.css) with checkout form and confirmation page styles.
- Added:
  - input styling
  - inline error states
  - confirmation card layout
  - order summary blocks
  - responsive adjustments for the recap grid

## Current Frontend State

### Working now
- Product data is isolated in [data.js](data.js) and includes `longDescription` for every product.
- The homepage and products page still load catalog data correctly.
- The cart page renders a Bootstrap table with summary totals and shipping logic.
- The checkout form is shown only when the cart is not empty.
- Real-time validation prevents submission until the customer details are valid.
- Submitting checkout creates an `orderData` object, logs it, stores it in `sessionStorage`, and redirects to [confirmation.html](confirmation.html).
- The confirmation page displays a success message and order recap.
- Favorites and cart state continue to persist in `localStorage`.

### Present UI structure
- [index.html](index.html): premium landing page with hero, featured products, and about section.
- [products.html](products.html): filtered product grid with details links and cart access.
- [panier.html](panier.html): cart table on the left and checkout summary/form on the right.
- [confirmation.html](confirmation.html): clean order success screen with recap.

## Validation
- Syntax checks returned no errors for:
  - [script.js](script.js)
  - [data.js](data.js)
  - [index.html](index.html)
  - [products.html](products.html)
  - [panier.html](panier.html)
  - [confirmation.html](confirmation.html)
  - [style.css](style.css)
