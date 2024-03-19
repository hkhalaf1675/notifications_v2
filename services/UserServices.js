const { Op } = require('sequelize');
const db = require('../models');
const ResponseSchema = require('../schemes/ResponseSchema');

exports.createOrUpdateUser = async(userId, email, firebaseToken) => {
    try {
        const olduser = await db.User.findOne({
            where: {
                [Op.or]: [
                    {userId: userId},
                    {email: email}
                ]
            }
        });

        if(!olduser){
            const newUser = await db.User.create({
                userId: userId,
                email: email,
                firebaseToken: firebaseToken
            });

            return new ResponseSchema(201,'user added successfully', newUser);
        }
        else{
            await db.User.update({
                userId: userId,
                email: email,
                firebaseToken: firebaseToken
            },{
                where: {
                    id: olduser.id
                }
            });

            return new ResponseSchema(200,'user updated successfully', null);
        }
    } catch (error) {
        return new ResponseSchema(500, error.message, null);
    }
}

exports.updateUser = async(id, userId, email, firebaseToken) => {
    try {
        const olduser = await db.User.findOne({
            where: {
                id: id
            }
        });

        if(!olduser){
            return new ResponseSchema(404,'there is no user with that id', null);
        }
        else{
            await db.User.update({
                userId: userId,
                email: email,
                firebaseToken: firebaseToken
            },{
                where: {
                    id: olduser.id
                }
            });

            return new ResponseSchema(200,'user updated successfully', null);
        }
    } catch (error) {
        return new ResponseSchema(500, error.message, null);
    }
}