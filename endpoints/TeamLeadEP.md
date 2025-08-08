## Dashboard
* **GET** /api/dashboard/stats - Retrieves dashboard statistics for the team lead, including team member count and project statuses.

## Projects
* **POST** /api/projects - Creates a new project, with the team lead assigned as the manager.

* **GET** /api/projects - Retrieves a list of all projects managed by the team lead.

* **GET** /api/projects/:id - Retrieves a specific project by its ID, but only if the team lead is the manager of that project.

* **PATCH** /api/projects/:id - Updates a project, but only if the team lead is the manager.

* **PATCH** /api/projects/:id/assign-task - Assigns a task within a project to a user.

## Teams
* **GET** /api/teams - Retrieves a list of teams that the team lead is a member of.

* **GET** /api/teams/:id - Retrieves the details of a specific team, but only if the team lead is a member of that team.

* **PATCH** /api/teams/:id/add-member - Adds a new member to a team that the team lead is a part of.