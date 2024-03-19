const {mailgun} = require('../config/MailGunConfig');
const ResponseSchema = require('../schemes/ResponseSchema');
const db = require('../models');
require('dotenv').config();

exports.sendMailToOneUser = async(userId, mailSubject, mailContent) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: userId
            }
        });
        if(!user){
            return new ResponseSchema(404, 'there is no user with that id', null);
        }
        else{
            await mailgun.messages.create(
                process.env.MAILGUN_DOMAIN,{
                    from: process.env.MAILGUN_USER,
                    to: user.email,
                    subject: mailSubject,
                    html: mailContent
                }
            )
            .then( async() => {
                await db.NotificationLog.create({
                    type: 'email',
                    title: mailSubject,
                    body: mailContent,
                    userId: user.id
                });

                return new ResponseSchema(200, 'Mail send successfully', null);
            })
            .catch(err => {
                return new ResponseSchema(500, err.message, null);
            });

            return new ResponseSchema(200, 'Mail send successfully', null);
        }
    } catch (error) {
        return new ResponseSchema(405, error.message, null);
    }
}

exports.sendMailToAllUsers = async(mailSubject, mailContent) => {
    try {
        let usersData = [];
        let pageNumber = 1;
        let sendingEmails = 0;
        do{
            usersData = await db.User.findAll({
                limit: 100,
                offset: (pageNumber - 1) * 100
            });

            let usersEmails = [];
            let logData = [];
            for (let user of usersData) {
                usersEmails.push(user.email);
                logData.push({
                    type: 'email',
                    title: mailSubject,
                    body: mailContent,
                    userId: user.id
                });
            }

            if(usersEmails.length > 0){
                await mailgun.messages.create(
                    process.env.MAILGUN_DOMAIN,{
                        from: process.env.MAILGUN_USER,
                        to: usersEmails,
                        subject: mailSubject,
                        html: mailContent
                    }
                )
                .then( async() => {
                    await db.NotificationLog.bulkCreate(logData);
                    sendingEmails += usersEmails.length;
                })
                .catch(err => {
                    return new ResponseSchema(500, err.message, null);
                });
            }

            pageNumber++;
        }while(usersData.length > 0);

        if(sendingEmails == 0){
            return new ResponseSchema(400, 'Failed In sending Emails', null);
        }
        else{
            return new ResponseSchema(200, `Success in sending ${sendingEmails} mails`, null);
        }
    } catch (error) {
        return new ResponseSchema(500, error.message, null);
    }
}