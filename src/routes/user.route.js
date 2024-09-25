const { Router } = require("express");
const { verifyJWt } = require("../middleware/auth.middleware");
const router = Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
} = require("../controller/user.controller");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

//secured-endpoints
router.use(verifyJWt);
router.post("/logout", logoutUser);
router.get("/", getCurrentUser);
router.post("/change-password", changeCurrentPassword);

module.exports = router;
