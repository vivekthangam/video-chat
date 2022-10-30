const meetingController = require("../controller/meeting.controller");
const userController = require("../controller/user.controller");
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

router.post("/meeting/start", meetingController.startMeeting);
router.post("/meeting/join", meetingController.checkMeetingExisits);
router.post("/meeting/get", meetingController.getAllMeetingUsers);
router.post("/meeting/get", meetingController.getAllMeetingUsers);
router.post("/me",auth,userController.getMe);
router.get("/me",auth,userController.getMe);
router.post("/auth/signUp",userController.authenticateUserValidator,userController.signUpUser);

router.post("/auth/signIn",userController.signInUser);

module.exports = router;