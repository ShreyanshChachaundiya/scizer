const express = require("express");
const userController = require("../controllers/userController");
const { check } = require("express-validator");

const router = express.Router();

router.get("/getAllUser", userController.getAllUser);
router.post(
  "/createUser",
  [
    check("name").not().isEmpty(),
    check("mobileNumber").isLength({ min: 10, max: 10 }),
  ],
  userController.createUser
);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  

router.patch(
  "/:id",
  [
    check("name").not().isEmpty(),
    check("mobileNumber").isLength({ min: 10, max: 10 }),
  ],
  userController.updateUser
);

module.exports = router;
