// authRoutes.js
const { Router } = require("express");
const authController = require('../authControllers/authControllers');

const router = Router();

router.get('/signUp', authController.signUp_get);
router.post('/signUp', authController.signUp_post);
router.get('/login', authController.login_get);
router.post('/login', authController.logIn_post);
router.get('/logout', authController.logout_get);



module.exports = router;
