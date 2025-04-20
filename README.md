# CardGenius Frontend (React + AWS Amplify)

This directory contains the frontend source code of **CardGenius**, a credit card management and recommendation web application. The app is built with **React** and styled using **CSS**, offering a responsive, user-friendly interface.  
Deployment is managed via **AWS Amplify**, with GitHub integration enabling continuous deployment.

---

## Architecture Overview

- **Framework**: React 18 (JSX-based SPA) + Vite
- **Styling**: CSS (`App.css`)
- **Deployment**: AWS Amplify (CI/CD with GitHub)
- **Hosting**: AWS Static Web Hosting
- **API Integration**: Fetch-based RESTful calls to AWS API Gateway

---

## Key Pages & Features

| Component/Page         | File                       | Description                                                                                    |
| ---------------------- | -------------------------- | ---------------------------------------------------------------------------------------------- |
| `LoginPage`            | `loginpage.jsx`            | Entry Page.                                                                                    |
| `RegisterPage`         | `registerpage.jsx`         | New user registration form.                                                                    |
| `SignInPage`           | `signinpage.jsx`           | Signin page.                                                                                   |
| `SearchCardPage`       | `searchcardpage.jsx`       | Form to select preferences for card recommendations.                                           |
| `SearchResultsPage`    | `searchresultspage.jsx`    | Displays top 1-3 card suggestions based on user input.(Premium:Top3;Free:Best one)             |
| `CreateCardPage`       | `createcardpage.jsx`       | Form to add a new card manually.                                                               |
| `CreateCardPageLayout` | `createcardpagelayout.jsx` | Wrapper layout for card creation process.                                                      |
| `CardListPage`         | `cardlist.jsx`             | Shows cards already added by the user.                                                         |
| `MyAccountPage`        | `myaccountpage.jsx`        | Displays and allows editing of user account info and TransactionSummary Pie Chart for Premium. |
| `TransactionSummary`   | `TransactionSummary.jsx`   | Visual pie chart of spending breakdown per card.                                               |
| `PageLayout`           | `pagelayout.jsx`           | Common layout component for pages with navigation.                                             |
| `Sidebar`              | `sidebar.jsx`              | Reusable sidebar navigation panel.                                                             |
| `Main`                 | `main.jsx`                 | Main entry page logic, likely includes routing.                                                |
| `App`                  | `App.jsx`                  | Root component with overall app logic and router.                                              |
| `Constants`            | `constants.jsx`            | Central config for static values like bank list.                                               |
| `API`                  | `api.jsx`                  | Contains 'fetch' functions for API calls.                                                      |

---

## Frontend–Backend Interaction

The frontend interacts with backend APIs hosted on AWS API Gateway using helper functions from `api.jsx`. Data is exchanged via JSON and typically includes:

- **Authentication** (`/login`, `/register`)
- **User Profile** (`/getUserProfile`, `/updateUserProfile`)
- **Card Operations** (`/getAllCards`, `/addCard`, `/deleteCard`)
- **Recommendations** (`/returnRecommendationResult`)
- **Transactions** (`/updateAccumulateAmount`, `/getTransactionSummary`)

---

## CI/CD with AWS Amplify

This project is deployed using **AWS Amplify**, connected directly to GitHub for **continuous integration and deployment**.  
Every push to the `main` branch automatically triggers a build and deployment pipeline, ensuring the latest updates are always live with zero manual steps.

This setup fits well with our serverless, scalable, and cloud-native infrastructure.

---

## Folder Structure Overview

```
src/
├── assets/                      # Static assets (if any)
├── App.css                      # App-wide styling
├── App.jsx                      # Root component with routing
├── TransactionSummary.jsx       # Spending breakdown chart
├── api.jsx                      # API fetch utility functions
├── cardlist.jsx                 # My Cards list
├── constants.jsx                # Config/constants (e.g., banks, card types)
├── createcardpage.jsx          # Card creation form
├── createcardpagelayout.jsx    # Card creation layout wrapper
├── index.css                    # Global styles
├── loginpage.jsx               # Login form
├── main.jsx                     # Main app router/logic
├── myaccountpage.jsx           # User profile page
├── pagelayout.jsx              # Shared layout wrapper
├── registerpage.jsx            # Registration form
├── searchcardpage.jsx          # Card search form
├── searchresultspage.jsx       # Card recommendations view
├── sidebar.jsx                 # Sidebar component
└── signinpage.jsx              # Optional alternative login
```
