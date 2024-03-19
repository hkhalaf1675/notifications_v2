const usersServices = require('../services/UserServices');

exports.createUser = async(req,res) => {
    try {
        const {userId, userEmail, userFcmToken} = req.body;
        if(!userId || !userEmail ){
            res.status(400).send({message: 'user id , and user email are required'});
        }
        else{
            const response = await usersServices.createOrUpdateUser(userId, userEmail,userFcmToken);
            if(response){
                if(response.code == 201){
                    res.status(response.code).json(response.data);
                }
                else{
                    res.status(response.code).send({message: response.message});
                }
            }
            else{
                res.status(400).send({message: 'bad request'});
            }
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

exports.updateUser = async(req,res) => {
    try {
        const {id, newUserId, newEmail, newFcmToken} = req.body;
        if(!id || !newUserId || !newEmail ){
            res.status(400).send({message: 'id, user id , and user email are required'});
        }
        else{
            const response = await usersServices.updateUser(id, newUserId, newEmail,newFcmToken);
            if(response){
                if(response.code == 200){
                    res.status(response.code).send({message: 'user updated successfully'});
                }
                else{
                    res.status(response.code).send({message: response.message});
                }
            }
            else{
                res.status(400).send({message: 'bad request'});
            }
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}