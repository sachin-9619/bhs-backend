const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");

// CRUD routes
router.get("/", routeController.getAllRoutesForAdmin);
router.post("/", routeController.addRoute);
router.put("/:id", routeController.updateRoute);
router.delete("/:id", routeController.deleteRoute);

module.exports = router;
