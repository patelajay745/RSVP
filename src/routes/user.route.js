const { Router } = require("express");
const { verifyJWt } = require("../middleware/auth.middleware");
const router = Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    // changeCurrentPassword,
    getCurrentUser,
} = require("../controller/user.controller");

router.post("/", registerUser);
router.get("/", verifyJWt, getCurrentUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWt, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWt, changeCurrentPassword);

module.exports = router;
