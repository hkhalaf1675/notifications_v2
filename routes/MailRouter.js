const { sendToOneUser, sendMailToAllUsers } = require('../controllers/MailsController');

const router = require('express').Router();

router.post('/api/mails/sendToOneUser', sendToOneUser);
router.post('/api/mails/sendToAllUsers', sendMailToAllUsers);

module.exports = router;