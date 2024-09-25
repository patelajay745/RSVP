const { Router } = require("express");
const { createEvent } = require("../controller/event.controller");
const { verifyJWt } = require("../middleware/auth.middleware");

const router = Router();

router.use(verifyJWt);
router.post("/", createEvent);

module.exports = router;
