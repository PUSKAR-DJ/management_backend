### API Endpoints

#### Authentication
* **POST** `/api/auth/signup` - User registration
* **POST** `/api/auth/login` - User login
* **GET** `/api/auth/logout` - User logout

#### Users (Protected)
*These endpoints require an authenticated user.*
* **GET** `/api/users/me` - Get current user's profile
* **PATCH** `/api/users/updateMe` - Update current user's information
* **DELETE** `/api/users/deleteMe` - Deactivate current user's account

#### Users (Manager Only)
*These endpoints require an authenticated user with the `manager` role.*
* **GET** `/api/users` - Get all users
* **POST** `/api/users` - Create a new user
* **GET** `/api/users/:id` - Get a user by ID
* **PATCH** `/api/users/:id` - Update a user by ID
* **DELETE** `/api/users/:id` - Delete a user by ID

#### Teams (Protected)
*These endpoints require an authenticated user. Some actions are role-restricted.*
* **GET** `/api/teams` - Get all teams
* **POST** `/api/teams` - Create a new team (Manager only)
* **GET** `/api/teams/:id` - Get a team by ID
* **PATCH** `/api/teams/:id` - Update a team by ID
* **DELETE** `/api/teams/:id` - Delete a team by ID
* **PATCH** `/api/teams/:id/add-member` - Add a member to a team

#### Dashboard
* **GET** `/api/dashboard/stats` - Get dashboard statistics (Manager only)

#### Projects
*These endpoints are protected and restricted to the `manager` and `team_lead` roles.*
* **POST** `/api/projects` - Create a new project
* **GET** `/api/projects` - Get all projects
* **GET** `/api/projects/payout` - Get a list of payout for each project
* **GET** `/api/projects/:id` - Get a project by ID
* **PATCH** `/api/projects/:id` - Update a project by ID
* **DELETE** `/api/projects/:id` - Delete a project by ID (Manager only)
* **PATCH** `/api/projects/:id/assign-task` - Assign a task to a user within a project

#### Reviews (Manager Only)
*These endpoints require an authenticated user with the `manager` role.*
* **POST** `/api/reviews` - Create a new review
* **GET** `/api/reviews` - Get all reviews
* **GET** `/api/reviews/:id` - Get a review by ID
* **PATCH** `/api/reviews/:id` - Update a review by ID
* **DELETE** `/api/reviews/:id` - Delete a review by ID

#### Reports (Manager Only)
*These endpoints are protected and restricted to the `manager` role.*
* **GET** `/api/reports/team-report` - Get a report of all team members under the manager, including project stats and deadlines
* **GET** `/api/reports/team-report/projects/:userId` - Get a list of projects for a specific team member

### Salary API
* **GET** /api/salaries
Description: Retrieves a list of all team members and their latest salary information for the manager's report view.

* **POST** /api/salaries/:userId
Description: Adds a new salary payment record for a specific user.
Body: { "amount": 4000, "month": "August", "year": 2025 }

### Received Data API
* **POST** /api/received-data
Description: Creates a new "received data" entry.
Body: JSON object with details like companyName, invoiceNumber, clientName, etc.

* **GET** /api/received-data
Description: Retrieves all data received by the manager.

* **GET** /api/received-data/:id
Description: Retrieves a single "received data" entry by its ID.

* **PATCH** /api/received-data/:id
Description: Updates a "received data" entry.

* **DELETE** /api/received-data/:id
Description: Deletes a "received data" entry.

## Team Lead Reviews 

* **POST** /api/tl/reviews
* **GET** /api/tl/reviews
* **GET** /api/tl/reviews/:id