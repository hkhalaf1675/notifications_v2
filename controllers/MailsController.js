const mailServices = require('../services/MailServices');

exports.sendToOneUser = async(req,res) => {
    try {
        const {userId, mailSubject, mailContent} = req.body;
        if(!userId || !mailSubject || !mailContent){
            res.status(400).send({message: 'user id , mail subject and content are required'});
        }
        else{
            const response = await mailServices.sendMailToOneUser(userId, mailSubject, mailContent);
            if(response){
                res.status(response.code).send({message: response.message});
            }
            else{
                res.status(400).send({message: 'bad request'});
            }
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}

exports.sendMailToAllUsers = async(req,res) => {
    try {
        const {mailSubject, mailContent} = req.body;
        if(!mailSubject || !mailContent){
            res.status(400).send({message: 'mail subject and content are required'});
        }
        else{
            const response = await mailServices.sendMailToAllUsers(mailSubject, mailContent);
            if(response){
                res.status(response.code).send({message: response.message});
            }
            else{
                res.status(400).send({message: 'bad request'});
            }
        }
    } catch (error) {
        res.status(500).send({message: error.message});
    }
}