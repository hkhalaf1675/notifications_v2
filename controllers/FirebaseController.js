const firebaseServices = require('../services/FirebaseServices');

exports.sendNotificationToOneUser = async(req,res) => {
    try {
        const {userId, title, body} = req.body;
        if(!userId || !title || !body){
            res.status(400).send({message: 'user id , notification title, and body are required'});
        }
        else{
            const response = await firebaseServices.sendNotificationToOneUser(userId, title, body);
            if(response){
                if(response.data){
                    res.status(response.code).json(response.data);
                }
                else{
                    res.status(response.code).send({message: response.message});
                }
            }
            else{
                res.status(400).send({message: 'failed in sending notification'});
            }
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

exports.sendNotificationToAllUsers = async(req,res) => {
    try {
        const {userId, title, body} = req.body;
        if(!title || !body){
            res.status(400).send({message: 'notification title, and body are required'});
        }
        else{
            const response = await firebaseServices.sendNotificationToAllUsers(title, body);
            if(response){
                if(response.data){
                    res.status(response.code).json(response.data);
                }
                else{
                    res.status(response.code).send({message: response.message});
                }
            }
            else{
                res.status(400).send({message: 'failed in sending notification'});
            }
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}