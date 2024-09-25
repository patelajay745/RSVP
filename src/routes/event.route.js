const { Router } = require("express");
const {
    createEvent,
    deleteEvent,
    toggelPublishedClosed,
} = require("../controller/event.controller");
const { verifyJWt } = require("../middleware/auth.middleware");

const router = Router();

router.use(verifyJWt);
router.post("/", createEvent);
router.delete("/:eventId", deleteEvent);

router.patch("/e/:eventId", toggelPublishedClosed);

module.exports = router;
