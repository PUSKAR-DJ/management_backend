Executive-Specific Endpoints
* **GET** /api/executive/my-projects - Retrieves the executive's pending and current projects.

* **GET** /api/executive/completed-projects - Retrieves the executive's completed projects.

* **GET** /api/executive/my-payout - Retrieves the executive's own salary and payment history.

General User Endpoints
* **GET** /api/users/me - Gets the executive's own user profile.

* **PATCH** /api/users/updateMe - Allows the executive to update their own profile information.

* **DELETE** /api/users/deleteMe - Allows the executive to deactivate their own account.

Team Endpoints
* **GET** /api/teams - Retrieves a list of teams that the executive is a member of.

Authentication
* **POST** /api/auth/signup - User registration.

* **POST** /api/auth/login - User login.

* **GET** /api/auth/logout - User logout.