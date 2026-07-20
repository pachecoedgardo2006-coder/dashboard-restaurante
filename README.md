<h1 align="center">House Grill 6 🍔🔥</h1>

<p align="center">
  <strong>Restaurant Management System</strong><br>
  A modular, robust, and secure web platform designed to optimize restaurant operations by managing products, inventory, customer orders, and sales in a centralized environment.
</p>

<p align="center">
  <a href="https://git-scm.com/">
    <img src="https://img.shields.io/badge/Monorepo-111111?style=for-the-badge">
  </a>
  <a href="https://www.conventionalcommits.org/">
    <img src="https://img.shields.io/badge/Conventional_Commits-1.0.0-FE5196?style=for-the-badge&logo=conventionalcommits&logoColor=white">
  </a>
</p>

---

<p align="center">
House Grill 6 is a restaurant management platform that centralizes the administration of products, categories, inventory, and customer orders. The system provides a responsive Single Page Application (SPA) connected to a secure REST API, allowing restaurant staff to efficiently manage daily operations while maintaining data consistency and inventory control.
</p>

---

# Table of Contents

- [Badges](#badges)
- [Key Features](#key-features)
- [Architecture and Technologies](#architecture-and-technologies)
- [Database Structure](#database-structure)
- [Core System Workflows](#core-system-workflows)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)
- [Team](#team)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

<div align="center">

# Badges

### Build & Tooling

<p>

<a href="https://vite.dev/">
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
</a>

<a href="https://git-scm.com/">
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
</a>

<a href="https://www.notion.so/">
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white">
</a>

</p>

### Frontend

<p>

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
<img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
</a>

<a href="https://vite.dev/">
<img src="https://img.shields.io/badge/Vite-SPA-646CFF?style=for-the-badge&logo=vite&logoColor=white">
</a>

<a href="https://tailwindcss.com/">
<img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
</a>

</p>

### Backend

<p>

<a href="https://expressjs.com/">
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white">
</a>

<a href="https://www.sqlite.org/">
<img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white">
</a>

<a href="#">
<img src="https://img.shields.io/badge/API-REST-25A162?style=for-the-badge">
</a>

</p>

### Deployment

<p>

<a href="https://vercel.com/">
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</a>

<a href="https://github.com/">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
</a>

</p>

</div>

---

# Key Features

- **Secure Authentication (RBAC):** Stateless authentication using JWT with role-based access control for **SuperAdmin**, **Admin**, **Mentor**, and **Learner** roles.
- **Order Management:** Create, update, monitor, and complete customer orders in real time.
- **Inventory Control:** Track stock levels and automatically update product availability after each sale.
- **Product & Category Management:** Organize the restaurant menu by categories and manage products through an intuitive dashboard.
- **Sales Dashboard:** Monitor restaurant activity through key metrics such as orders, products sold, and inventory status.
- **REST API Architecture:** Modular backend exposing secure RESTful endpoints for all business operations.
- **Axios Global Interceptor:** Automatically injects authentication tokens into every protected request.
- **Backend Security:** Password hashing using Bcrypt and secure session management with JWT.
- **Single Page Application (SPA):** Lightweight and responsive frontend built with Vanilla JavaScript and Vite.

---

# Architecture and Technologies

| Layer | Technology / Dependency | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla ES6+) | Responsive and modular Single Page Application. |
| **Styling** | Tailwind CSS v4 | Utility-first modern styling. |
| **HTTP Client** | Axios | HTTP client with global authentication interceptors. |
| **Backend** | Node.js & Express.js | Modular REST API built with ECMAScript Modules. |
| **Database** | SQLite | Lightweight relational database for restaurant operations. |
| **Security** | `jsonwebtoken` / `bcrypt` | Authentication, authorization and password hashing. |
| **Core Utilities** | `dotenv`, `cors`, `uuid` | Environment variables, CORS support and unique identifiers. |

# Database Structure

The relational database is designed to reduce redundancy while maintaining data integrity through normalized tables and foreign key relationships. This structure ensures efficient restaurant operations by managing products, inventory, orders, and users in a scalable way.

```text
                    ┌──────────────┐
                    │     role     │
                    └──────┬───────┘
                           │ 1:N
                    ┌──────▼───────┐
                    │     user     │
                    └──────┬───────┘
                           │
               ┌───────────┼────────────┐
               │           │            │
         ┌─────▼─────┐ ┌───▼─────┐ ┌────▼─────┐
         │ inventory │ │ category│ │ product  │
         └─────┬─────┘ └────┬────┘ └────┬─────┘
               │            │           │
               │            └─────┬─────┘
               │                  │
               │             1:N  │
               │                  ▼
               │            ┌───────────┐
               └───────────►│order_item │◄──────────┐
                            └────┬──────┘           │
                                 │                  │
                                 │ N:1              │
                                 ▼                  │
                            ┌───────────┐           │
                            │   order   │───────────┘
                            └───────────┘
```

### Main Tables

- **role / user:** Provides Role-Based Access Control (RBAC) with support for **SuperAdmin**, **Admin**, **Mentor**, and **Learner** roles.

- **category:** Stores the different menu categories such as burgers, drinks, desserts, and side dishes.

- **product:** Contains the restaurant menu, including prices, descriptions, availability, and category assignments.

- **inventory:** Tracks stock quantities for each product, allowing inventory monitoring and preventing unavailable items from being sold.

- **order:** Represents customer orders, including order status, creation date, total amount, and the employee responsible.

- **order_item:** Stores every product included in an order along with its quantity and subtotal.

---

# Core System Workflows

## 1. Authentication Flow

- A user logs into the system using their credentials.
- The backend validates the credentials against the database.
- If authentication succeeds, a JWT token containing the user's ID and role is generated.
- The client stores the token and includes it in every protected request.

---

## 2. Authorization Flow (Middleware)

Every request to protected endpoints is intercepted by the authentication middleware.

The middleware:

- Extracts the Bearer Token from the Authorization header.
- Verifies the JWT signature and expiration.
- Retrieves the authenticated user's information.
- Injects the user into `req.user`.
- Validates permissions according to the assigned role.

Only authorized users can access administrative resources.

---

## 3. Order Management Flow

```text
[Frontend]
       │
       │ POST /api/orders
       ▼
[Authentication Middleware]
       │
       ▼
[orders.controller.js]
       │
       ├── Validate products
       ├── Verify inventory
       ├── Create order
       ├── Create order details
       ├── Update inventory
       └── Return response
```

The system automatically updates inventory after every successful order, ensuring stock consistency.

---

## 4. Inventory Management Flow

```text
Administrator

        │

        ▼

Inventory Module

        │

        ▼

Update Product Stock

        │

        ▼

SQLite Database

        │

        ▼

Dashboard Updated
```

This process guarantees that inventory information remains synchronized with restaurant operations.

---

# Project Structure

```text
House-Grill-6/
│
├── apps/
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   ├── router/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── styles/
│   │   │   ├── utils/
│   │   │   └── main.js
│   │   │
│   │   ├── index.html
│   │   └── package.json
│   │
│   └── backend/
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── database/
│       │   ├── middlewares/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── utils/
│       │   └── app.js
│       │
│       ├── package.json
│       └── index.js
│
├── docs/
│   ├── frontend/
│   ├── backend/
│   ├── database/
│   ├── scrum/
│   └── api/
│
├── README.md
└── .gitignore
```

The project follows a **Monorepo architecture**, separating frontend, backend, documentation, and configuration into independent modules. This structure improves maintainability, scalability, and collaborative development while keeping a clean project organization.
# Installation and Setup

## Prerequisites

Before running the project, make sure you have the following tools installed:

- Node.js (v18 or later recommended)
- npm (included with Node.js)
- SQLite3
- Git

---

## Clone the Repository

```bash
git clone https://github.com/your-organization/house-grill-6.git
cd House-Grill-6
```

---

## Backend Setup

1. Navigate to the backend folder:

```bash
cd apps/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file inside `apps/backend` using the variables shown in the next section.

4. Create the SQLite database by executing the provided SQL script.

5. Start the backend server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

---

## Frontend Setup

Open a new terminal.

1. Navigate to the frontend folder:

```bash
cd apps/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Running the Entire Monorepo

From the project's root directory:

```bash
npm install
npm run dev
```

This command starts both the backend and frontend simultaneously using **concurrently**.

---

# Environment Variables

## Backend (`apps/backend/.env`)

```env
PORT=3000

DB_PATH=./database/house_grill.db

JWT_SECRET=your_super_secret_key

JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:5173
```

### Variable Description

| Variable | Description |
| :--- | :--- |
| `PORT` | Backend server port. |
| `DB_PATH` | Path to the SQLite database file. |
| `JWT_SECRET` | Secret key used to sign JWT tokens. |
| `JWT_EXPIRES_IN` | Authentication token expiration time. |
| `CORS_ORIGIN` | Allowed frontend origin. |

---

## Frontend (`apps/frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL of the REST API. |

---

# Roadmap

The project development follows an incremental Scrum methodology divided into three sprints.

## Sprint 1 — Planning & Foundation

- Define project scope
- Gather functional requirements
- Design the relational database
- Create the product backlog
- Configure GitHub repository
- Prepare technical documentation
- Build low-fidelity wireframes

---

## Sprint 2 — Development

### Backend

- JWT Authentication
- REST API
- Product CRUD
- Category CRUD
- Inventory Management
- Order Management
- Middleware implementation
- Global Error Handling

### Frontend

- Login Page
- Dashboard
- Product Management
- Category Management
- Inventory Module
- Order Module
- API Integration
- Route Protection

---

## Sprint 3 — Testing & Deployment

- Functional Testing
- Bug Fixing
- Code Refactoring
- API Validation
- Performance Improvements
- Final Documentation
- Deployment to Vercel
- Final Presentation

---

## Future Improvements

- Customer Management
- Sales Analytics Dashboard
- PDF Invoice Generation
- Email Notifications
- Mobile Responsive Improvements
- Barcode Scanner Integration
- Online Payment Gateway
- Multi-Branch Restaurant Support
- Real-Time Inventory Synchronization
- Role Permission Management Panel

---
# Team

House Grill 6 was developed following the Scrum framework, promoting collaboration, continuous feedback, and incremental software delivery.

| Team Member | Scrum Role | Technical Role |
| :--- | :--- | :--- |
| **Member 1** | Product Owner | Backend Developer |
| **Member 2** | Scrum Master | Frontend Developer |
| **Member 3** | Developer | Backend Developer |
| **Member 4** | Developer | Frontend Developer |
| **Member 5** | Developer | Frontend Developer |
| **Member 6** | Developer | QA & Documentation |

### Scrum Roles

#### Product Owner

Responsible for defining the product vision, prioritizing the Product Backlog, and ensuring the project meets stakeholder requirements.

#### Scrum Master

Facilitates Scrum events, removes impediments, and ensures the team follows Agile best practices.

#### Development Team

Responsible for designing, implementing, testing, and delivering functional software increments during every sprint.

---

# Documentation

The project documentation is organized into different modules to simplify maintenance and provide clear technical references.

```text
docs/
│
├── api/
│   ├── endpoints.md
│   ├── authentication.md
│   └── error-handling.md
│
├── backend/
│   ├── architecture.md
│   ├── controllers.md
│   ├── routes.md
│   └── services.md
│
├── database/
│   ├── database-design.md
│   ├── er-diagram.png
│   └── schema.sql
│
├── frontend/
│   ├── architecture.md
│   ├── routing.md
│   └── components.md
│
└── scrum/
    ├── product-backlog.md
    ├── sprint-planning.md
    ├── sprint-review.md
    └── retrospective.md
```

### Main Documentation

| Module | Description |
| :--- | :--- |
| **API** | REST endpoints, authentication flow, request/response examples, and error handling. |
| **Backend** | Project architecture, controllers, routes, services, middleware, and utilities. |
| **Frontend** | SPA architecture, routing, reusable components, services, and UI structure. |
| **Database** | Relational model, ER diagram, normalization, and SQL schema. |
| **Scrum** | Product Backlog, Sprint Planning, Sprint Reviews, Retrospectives, and project management artifacts. |

---

# Contributing

We welcome contributions that improve the quality, performance, and maintainability of House Grill 6.

Before contributing, please follow these guidelines.

## Branch Strategy

```text
main
│
├── developing
│
├── jandy_dev
├── dev_elianis
├── dev_mauricio
├── dev_moises
├── dev_maría
└── dev_edgardo
```

Each developer must work only on their own development branch.

---

## Commit Convention

The project follows the **Conventional Commits** specification.

Examples:

```bash
git commit -m "feat(products): add product creation endpoint"

git commit -m "fix(auth): validate expired JWT"

git commit -m "docs(readme): improve installation guide"

git commit -m "refactor(orders): simplify inventory validation"
```

Common commit prefixes:

| Prefix | Description |
| :--- | :--- |
| **feat** | New feature |
| **fix** | Bug fix |
| **docs** | Documentation changes |
| **style** | Formatting or styling |
| **refactor** | Code restructuring |
| **test** | Tests |
| **chore** | Maintenance tasks |

---

## Pull Requests

Before opening a Pull Request, ensure that:

- Your branch is synchronized with the target branch.
- All changes have been tested.
- No unnecessary files are included.
- The project builds successfully.
- Documentation has been updated if required.

---

## Coding Standards

- Follow the existing project structure.
- Use meaningful variable and function names.
- Write modular and reusable code.
- Prefer asynchronous programming using `async/await`.
- Handle errors consistently.
- Keep controllers lightweight by delegating business logic to services.
- Use environment variables for sensitive information.
- Follow REST API conventions.
- Apply clean architecture principles whenever possible.

---

# License

This project was developed for academic purposes as part of the **Riwi Software Development Program**.

It is intended exclusively for educational use.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

**House Grill 6**  
*A modern Restaurant Management System built with JavaScript, Express.js, SQLite, and Vite.*

Made with ❤️ by the **House Grill 6 Development Team**

</div>
