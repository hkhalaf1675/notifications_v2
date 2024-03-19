const formData = require('form-data')
const MailGun = require('mailgun.js');
require('dotenv').config();

const mg = new MailGun(formData);
exports.mailgun = mg.client({
        username: process.env.MAILGUN_USERNAME,
        key: process.env.MAILGUN_APIKEY
    });
