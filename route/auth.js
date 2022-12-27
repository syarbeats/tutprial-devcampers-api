const express =  require('express');
const { protect } = require('../middleware/auth');

const { register,
        login,
        getMe,
        forgotPassword,
        resetPassword 
        } = require('../controller/auth');

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:resettoken', resetPassword);

module.exports = router;
