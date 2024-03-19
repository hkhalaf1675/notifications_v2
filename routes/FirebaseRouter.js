const { sendNotificationToOneUser, sendNotificationToAllUsers } = require('../controllers/FirebaseController');

const router = require('express').Router();

router.post('/api/firebase/sendToOneUser', sendNotificationToOneUser);
router.post('/api/firebase/sendToAllUsers', sendNotificationToAllUsers);

module.exports = router;