## Authentication
* **POST** /api/auth/signup - User registration.

* **POST** /api/auth/login - User login.

* **GET** /api/auth/logout - User logout.

## Users (Protected)
* **GET** /api/users/me - * **GET** current user's profile.

* **PATCH** /api/users/updateMe - Update current user's information.

DELETE /api/users/deleteMe - Deactivate current user's account.

## Users (Manager Only)
* **GET** /api/users - * **GET** all users.

* **POST** /api/users - Create a new user.

* **GET** /api/users/:id - * **GET** a user by ID.

* **PATCH** /api/users/:id - Update a user by ID.

DELETE /api/users/:id - Delete a user by ID.

## Teams
* **GET** /api/teams - * **GET** all teams.

* **POST** /api/teams - Create a new team.

* **GET** /api/teams/:id - * **GET** a team by ID.

* **PATCH** /api/teams/:id - Update a team by ID.

DELETE /api/teams/:id - Delete a team by ID.

* **PATCH** /api/teams/:id/add-member - Add a member to a team.

## Dashboard
* **GET** /api/dashboard/stats - * **GET** dashboard statistics.

## Projects
* **POST** /api/projects - Create a new project.

* **GET** /api/projects - * **GET** all projects.

* **GET** /api/projects/payout - * **GET** a list of payout for each project.

* **GET** /api/projects/:id - * **GET** a project by ID.

* **PATCH** /api/projects/:id - Update a project by ID.

DELETE /api/projects/:id - Delete a project by ID.

* **PATCH** /api/projects/:id/assign-task - Assign a task to a user within a project.

## Reviews (Manager Only)
* **POST** /api/reviews - Create a new review.

* **GET** /api/reviews - * **GET** all reviews.

* **GET** /api/reviews/:id - * **GET** a review by ID.

* **PATCH** /api/reviews/:id - Update a review by ID.

DELETE /api/reviews/:id - Delete a review by ID.

## Reports (Manager Only)
* **GET** /api/reports/team-report - * **GET** a report of all team members under the manager.

* **GET** /api/reports/team-report/projects/:userId - * **GET** a list of projects for a specific team member.

## Salary API (Manager Only)
* **GET** /api/salaries - Retrieves a list of all team members and their latest salary information.

* **POST** /api/salaries/:userId - Adds a new salary payment record for a specific user.

## Received Data API (Manager Only)
* **POST** /api/received-data - Creates a new "received data" entry.

* **GET** /api/received-data - Retrieves all data received by the manager.

* **GET** /api/received-data/:id - Retrieves a single "received data" entry by its ID.

* **PATCH** /api/received-data/:id - Updates a "received data" entry.

DELETE /api/received-data/:id - Deletes a "received data" entry.