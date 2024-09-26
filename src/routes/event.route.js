const { Router } = require("express");
const {
    createEvent,
    deleteEvent,
    toggelPublishedClosed,
    listAllEvents,
    getEvent,
    updateEvent,
    getEventByShortUrl,
    getAttendies,
} = require("../controller/event.controller");
const { verifyJWt } = require("../middleware/auth.middleware");

const router = Router();

router.get("/:shortUrl", getEventByShortUrl);

router.use(verifyJWt);
router.post("/", createEvent);

router.get("/", listAllEvents);
router.get("/e/:eventId", getEvent);

router.delete("/:eventId", deleteEvent);

router.patch("/:eventId", updateEvent);
router.patch("/e/:eventId", toggelPublishedClosed);

router.get("/f/:eventId", getAttendies);

module.exports = router;
