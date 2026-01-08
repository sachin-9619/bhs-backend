const express = require("express");
const router = express.Router();
const routesController = require("../controllers/routeController");

// ✅ ROUTES APIs
router.get("/", routesController.getAllRoutesForAdmin);
router.post("/", routesController.addRoute);
router.put("/:id", routesController.updateRoute);
router.delete("/:id", routesController.deleteRoute);

module.exports = router;
