# EcoFinds - Sustainable Second-Hand Marketplace - UI Prototype

This project is a UI prototype for an e-commerce application called "EcoFinds - Sustainable Second-Hand Marketplace," which focuses on eco-friendly and sustainable products. This README provides an overview of the user interface and its features.

**Important Note:** This is a prototype version. The UI is built with static data and does not have a functional backend. Future versions will integrate with a proper backend to provide full functionality, including user authentication, product management, and order processing.

## UI Overview

The application is a single-page application (SPA) with a clean and modern design. The UI is built with React, TypeScript, and styled with Tailwind CSS and shadcn-ui components.

### Main Pages & Components

*   **Landing Page**: This is the main entry point of the application. It features a hero section with a call-to-action to "Start Shopping" or "Sell Your Items." Below the hero section, there is a list of products that can be filtered by category.

*   **Navigation**: The navigation bar is present on all pages and includes a search bar, a shopping cart icon with a badge indicating the number of items, and a user profile/login button.

*   **Product Grid**: Products are displayed in a grid layout. Each product is presented in a `ProductCard` component that shows an image, title, price, and category.

*   **Category Filter**: Users can filter the products by selecting a category from a list.

*   **Shopping Cart**: The cart page displays a list of items added to the cart. Users can adjust the quantity of each item or remove them. The cart also shows an order summary with the subtotal, shipping costs, and total amount.

*   **Authentication**: The UI includes a basic authentication flow with pages for login and signup. In this prototype, the authentication is not functional.

*   **Dashboard**: A user dashboard is available for logged-in users to view their profile and manage their products.

*   **Add Product**: A form is available for users to add new products to the shop.

## Technologies Used

*   **Vite**: A fast and modern build tool.
*   **TypeScript**: For type-safe JavaScript.
*   **React**: A JavaScript library for building user interfaces.
*   **shadcn-ui**: A collection of reusable UI components.
*   **Tailwind CSS**: A utility-first CSS framework for styling.

## Running the Project

To run this project locally, follow these steps:

1.  Clone the repository.
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Start the development server:
    ```sh
    npm run dev
    ```

This will start the application on `localhost:8080`.
