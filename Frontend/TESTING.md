# ExpenseFlow & Moneybag Integration Testing Guide

This guide explains how to spin up the local development environment and run manual verification tests for both the frontend (`Moneybag`) and backend (`ExpenseFlow`).

---

## 1. Prerequisites

Make sure you have the following installed on your machine:

- **Java 17** (or later)
- **Node.js** (v18 or later) & **npm** (or Bun/yarn)
- **Docker Desktop** (required to run the MySQL container)

---

## 2. Setting Up and Running the Backend

The backend is a Java Spring Boot application which uses a local MySQL database running inside a Docker container.

### Step 2.1: Start the MySQL Database

1. Open your terminal and navigate to the backend project directory:
   ```bash
   cd /Users/kameshr/Desktop/ExpenseFlow
   ```
2. Start the Docker Desktop application if it is not already running.
3. Start the database container:
   ```bash
   docker compose up -d
   ```
4. Verify that the MySQL service is running on port `3307`:
   ```bash
   docker compose ps
   ```

### Step 2.2: Run Spring Boot

1. Set execution permissions for the Maven wrapper (if needed):
   ```bash
   chmod +x mvnw
   ```
2. Run the application:
   ```bash
   ./mvnw clean spring-boot:run
   ```
   _Note: If your system uses a different Java version, export your Java 17 path:_
   ```bash
   export JAVA_HOME=$(/usr/libexec/java_home -v 17)
   ./mvnw clean spring-boot:run
   ```
3. Confirm that the API is running by loading the API health page:
   - URL: `http://localhost:8000/api/` (Expected text: `Hello World!`)
   - Swagger Documentation: `http://localhost:8000/api/swagger-ui/index.html` (Use this to inspect schema definitions).

---

## 3. Setting Up and Running the Frontend

The frontend is a Vite-based single-page application using TanStack React Router, React Query, and Tailwind CSS.

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd /Users/kameshr/Desktop/frontend-main
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the local Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL (typically `http://localhost:5173`).

---

## 4. Manual Test Scenarios

### Test Scenario 4.1: Authentication & Route Protection

1. Open the application at `http://localhost:5173/dashboard`.
2. **Verify Redirect**: You should be automatically redirected to `http://localhost:5173/sign-in` because no active token is present in storage.
3. **Login Action**:
   - The sign-in form is pre-filled with the seed user:
     - **Email**: `honza@gmail.com`
     - **Password**: `password`
   - Click **Sign In**.
   - **Expected**: A success toast notification appears, the browser redirects to `/dashboard`, and the top-right header displays the user's name: **Jan Babák**.

---

### Test Scenario 4.2: Dashboard & Account Management (CRUD)

1. **Load Accounts**: On the Dashboard, verify that the application fetches and displays the three seeded accounts:
   - **Savings** (EUR)
   - **Current** (EUR)
   - **Family budget** (EUR)
2. **Add Account**:
   - Click the **Add Account** button in the header.
   - Enter:
     - **Name**: `Holiday Trip`
     - **Initial Balance**: `1500`
     - **Currency**: `EUR`
     - **Color**: Select any color
     - **Check**: _Include in total statistics and charts_
   - Click **Create Account**.
   - **Expected**: Toast shows "Account created successfully", the dialog closes, and the card for `Holiday Trip` is displayed with `1,500.00 EUR`.
3. **Edit Account**:
   - Click the **Pencil** icon on the `Holiday Trip` card.
   - Change the name to `Vacation Fund` and balance to `1800`.
   - Click **Save Changes**.
   - **Expected**: The account updates to show `Vacation Fund` with `1,800.00 EUR`.
4. **Delete Account**:
   - Click the **Trash** icon on the `Vacation Fund` card.
   - Confirm the browser warning popup.
   - **Expected**: Toast shows "Account deleted successfully" and the card is removed.

---

### Test Scenario 4.3: Transaction Records Management (CRUD)

1. Navigate to the **Records** tab.
2. **Verify Filter Capabilities**:
   - Search for a term in the search box (e.g. `ETFs` or `Salary`).
   - Select a Category filter (e.g. `Investments` or `Salary, wage`).
   - Select an Account filter.
   - **Expected**: The list should filter matching records on each change.
3. **Add Record (Expense)**:
   - Click **Add Record**.
   - Set details:
     - **Type**: `Expense`
     - **Amount**: `25.50`
     - **Label**: `Supermarket Groceries`
     - **Note**: `Bought fruits and milk`
     - **Date**: Select today's date/time
     - **Account**: `Current`
     - **Category**: `Food, Groceries`
   - Click **Add Record**.
   - **Expected**: Toast alerts success, list updates, and the amount `-25.50 EUR` is shown in red.
4. **Add Record (Income)**:
   - Click **Add Record**.
   - Set details:
     - **Type**: `Income`
     - **Amount**: `200.00`
     - **Label**: `Freelance Work`
     - **Date**: Select today's date
     - **Account**: `Savings`
     - **Category**: `Salary, wage`
   - Click **Add Record**.
   - **Expected**: Toast alerts success, amount `200.00 EUR` is shown in green.
5. **Edit Record**:
   - Click the **Pencil** icon next to `Supermarket Groceries`.
   - Change amount to `30.00` and label to `Local Supermarket`.
   - Click **Save Changes**.
   - **Expected**: Details update successfully in the list.
6. **Delete Record**:
   - Click the **Trash** icon next to `Local Supermarket`.
   - Confirm deletion.
   - **Expected**: The record is removed from the table.

---

### Test Scenario 4.4: Analytics & Visualizations

1. Navigate to the **Analytic** tab.
2. **Verify Ranges**: The date range inputs default to `2023-03-01` and `2023-03-31` (matching the seed record ranges).
3. **Verify Charts**:
   - **Spending Summary**: Displays total balance, incomes, expenses, and cash flow for March 2023.
   - **Categories Split**: PieChart renders the percentage breakdown (e.g. food vs investments). Hovering over slices shows amounts.
   - **Balance Evolution**: LineChart displays the balance timeline chart.
4. **Interactive Filters**: Change the dates (e.g., set start date to `2023-01-01`).
   - **Expected**: The charts reload dynamically to fetch and display data in the new range.

---

### Test Scenario 4.5: Sign Out

1. Click the **Logout** (exit door) icon in the top-right header.
2. **Expected**: Token is deleted and you are redirected back to the `/sign-in` screen.
