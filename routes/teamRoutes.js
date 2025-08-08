const express = require("express")
const teamController = require("../controllers/teamController")
const authController = require("../controllers/authController")

const router = express.Router()

// Protect all routes
router.use(authController.protect)

router.route("/").get(teamController.getAllTeams).post(authController.restrictTo("manager"), teamController.createTeam)

router.route("/:id").get(teamController.getTeam).patch(teamController.updateTeam).delete(teamController.deleteTeam)

router.patch("/:id/add-member", teamController.addTeamMember)

module.exports = router
