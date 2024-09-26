const { Router } = require("express");
const { verifyJWt } = require("../middleware/auth.middleware");
const {
    createFamily,
    deleteFamily,
} = require("../controller/family.controller");

const router = Router();

router.post("/", createFamily);
router.delete("/:eventId/:familyId", verifyJWt, deleteFamily);

module.exports = router;
