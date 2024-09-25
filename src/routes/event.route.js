const { Router } = require("express");
const {
    createEvent,
    deleteEvent,
    toggelPublishedClosed,
    listAllEvents,
    getEvent,
    updateEvent,
} = require("../controller/event.controller");
const { verifyJWt } = require("../middleware/auth.middleware");

const router = Router();

router.use(verifyJWt);
router.post("/", createEvent);

router.get("/", listAllEvents);
router.get("/:eventId", getEvent);

router.delete("/:eventId", deleteEvent);

router.patch("/:eventId", updateEvent);
router.patch("/e/:eventId", toggelPublishedClosed);

module.exports = router;
