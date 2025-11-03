# ReactCart E-Commerce - Frontend (React App)

A beautiful React shopping website where customers can browse products, add to cart, place orders, and admins can manage the store.

## What Does This Do?

CUSTOMER FEATURES:
✓ Browse products
✓ Search and filter products
✓ View product details
✓ Add to shopping cart
✓ Checkout and place orders
✓ Write product reviews
✓ Manage profile
✓ View order history

ADMIN FEATURES:
✓ Manage products (add, edit, delete)
✓ Upload product images
✓ Manage categories
✓ View all orders
✓ View all customers
✓ See sales dashboard/analytics

## What You Need to Install

1. Node.js 16 or higher
   Download from: https://nodejs.org/

2. npm (comes with Node.js)
   Check: Open command prompt and type: npm --version

3. Git (optional but recommended)
   Download from: https://git-scm.com/

## Setup Instructions (Step by Step)

### STEP 1: Download the Project
git clone https://github.com/nabilnko/reactcart-ecom-frontend.git
cd reactcart-ecom-frontend

### STEP 2: Install Dependencies
npm install
(This may take 2-3 minutes)

### STEP 3: Create Environment File
Create a new file named `.env.local` in the project root folder with:

NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_API_PROXY=true
API_PROXY_TARGET=http://localhost:8080

### STEP 4: Make Sure Backend is Running
Check that backend is running on: http://localhost:8080

### STEP 5: Start the Frontend
npm run dev

You should see: "ready - started server on 0.0.0.0:3000"

Frontend is now running on: http://localhost:3000

### STEP 6: Open in Browser
Open your browser and go to: http://localhost:3000

That's it! The website is live!

## Important Notes

BACKEND MUST BE RUNNING:
The frontend needs the backend to work. Make sure backend is running on port 8080 before starting the frontend.

LOGIN CREDENTIALS:
Use these to login as admin:
Email: admin@shophub.com
Password: admin123

API CALLS:
All product, order, and user data comes from the backend API. If something doesn't work, check if backend is running.

## Project Structure

/public - Images and logos
/src
  /components - Reusable UI components
  /pages - Website pages (home, shop, cart, etc.)
  /contexts - React context for state management
  /services - API calls to backend
  /utils - Helper functions
  /styles - CSS files

MAIN PAGES:
/ - Home page with products
/shop - Browse all products
/cart - Shopping cart
/checkout - Place order
/orders - View my orders
/profile - User profile
/admin - Admin dashboard

## Available Commands

npm run dev - Start development server
npm run build - Create production build
npm run start - Start production server
npm run lint - Check for code errors

## Technology Used

React 19 - UI framework
Next.js - React framework
TypeScript - Type safety
Tailwind CSS - Styling
Context API - State management

## Troubleshooting

Problem: "npm: command not found"
Solution: Install Node.js from https://nodejs.org/

Problem: "Cannot reach backend"
Solution: Make sure backend is running on http://localhost:8080
         Check: curl http://localhost:8080/api/products

Problem: "Port 3000 already in use"
Solution: Kill the process or use different port:
         npm run dev -- -p 3001

Problem: "Blank page or errors"
Solution: Open browser console (F12) to see error messages
         Check network tab to see API calls

## How to Use

CUSTOMERS:
1. Browse products on /shop
2. Click product for details
3. Add to cart
4. Go to /cart
5. Checkout and place order
6. View order in /orders

ADMIN:
1. Go to /admin
2. Add/edit/delete products
3. Upload product images
4. Manage orders and customers
5. View analytics dashboard

## Need Help?

GitHub: https://github.com/nabilnko/reactcart-ecom-frontend
Backend GitHub: https://github.com/nabilnko/reactcart-ecom-backend
