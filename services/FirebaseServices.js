const { Op } = require('sequelize');
const firebaseAdmin = require('../config/firebase/FirebaseConfig');
require('dotenv').config();
const db = require('../models');
const ResponseSchema = require('../schemes/ResponseSchema')

exports.sendNotificationToOneUser = async(userId, title, body) => {
    try {
        const user = await db.User.findByPk(userId);
        if(!user){
            return new ResponseSchema(404, 'there is no users with that id', null);
        }
        else{
            if(!user.firebaseToken){
                return new ResponseSchema(400, 'that user does not have firebase token', null);
            }
            else{
                await firebaseAdmin.admin.messaging().send({
                    token: user.firebaseToken,
                    notification: {
                        title: title,
                        body: body
                    },
                    android: {
                        notification: {
                            title: title,
                            body: body
                        }
                    }
                })
                .then(async(response) => {
                    await db.NotificationLog.create({
                        type: 'firebase',
                        title: title,
                        body: body,
                        userId: userId
                    });
                    return new ResponseSchema(200, 'Notification was send successfully', null);
                })
                .catch((error) => {
                    return new ResponseSchema(500, error.message, null);
                });

                return new ResponseSchema(500, 'failed in sending notifications', null);
            }
        }
    } catch (error) {
         return new ResponseSchema(500, error.message, null);
    }
}

exports.sendNotificationToAllUsers = async(title, body) => {
    try {
        let usersData = [];
        let pageNumber = 1;
        let sendingNotifications = 0;
        do{
            usersData = await db.User.findAll({where: {
                firebaseToken: {
                    [Op.ne]: null
                }
            }},{
                limit: 100,
                offset: (pageNumber - 1) * 100
            });

            let usersTokens = [];
            let logData = [];
            for (let user of usersData) {
                if(user.firebaseToken){
                    usersTokens.push(user.firebaseToken);
                    logData.push({
                        type: 'firebase',
                        title: title,
                        body: body,
                        userId: user.id
                    });
                }
            }

            if(usersTokens.length > 0){
                await firebaseAdmin.admin.messaging().sendEachForMulticast({
                    tokens: usersTokens,
                    notification: {
                        title: title,
                        body: body
                    },
                    android: {
                        title: title,
                        body: body
                    }
                })
                .then(async(response) => {
                    await db.NotificationLog.bulkCreate(logData);
                })
                .catch((error) => {
                    return new ResponseSchema(500, error.message, null);
                });
            }

            pageNumber++;
        }while(usersData.length > 0);

        if(sendingNotifications == 0){
            return new ResponseSchema(400, 'Failed In sending Notifications', null);
        }
        else{
            return new ResponseSchema(200, `Success in sending ${sendingNotifications} notification`, null);
        }
    } catch (error) {
        return new ResponseSchema(500, error.message, null);
    }
}