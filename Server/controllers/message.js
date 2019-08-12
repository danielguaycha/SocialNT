const sequelize = require('sequelize')
const { Message, User } = require('./../db');
const fn = require('./fn');
const _ = require('underscore');

function addMessage(req, res){
    let r = req.body;
    if(!r.receiver || !r.text ){
        return fn.error(res, 'Proporciona un destinatario y un mensaje');
    }

    Message.create({
        receiver: r.receiver,
        emitter: req.user.id,
        text: r.text,
        created_at: `${fn.date()}`
    }).then(message => {
        if(!message)
            return fn.error(res, 'No se ha enviado el mensaje');
                        
        return fn.all(res, message);
    }).catch(err => {
        console.log(err);
        fn.except(res, err);
    })
}

function getMessages(req, res){
    let page = 0;
    let pageSize = 10;

    if(req.query.page)
        page = req.query.page;

    const offset = page * pageSize
    const limit = offset + pageSize

    const emitter = req.params.emitter;

    Message.findAll({
        limit,
        offset,
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        {receiver: req.user.id}, {emitter}
                    ]
                },
                {  
                    [Op.and]: [
                        {receiver: emitter}, { emitter: req.user.id }
                    ]
                }
            ]
            
        },
        include: [{ model: User, as: 'user_emitter', attributes: ['name', 'lastname', 'avatar'] }],
        order: [ ['created_at', 'desc']]
    }).then(async messages => {
        if(!messages) return fn.error(res, 'No tienes mensajes')
        let user = await getUser(req.params.emitter);
        //if(messages.length <= 0) return fn.error(res, 'No tienes mensajes (0)')       
        return fn.object(res, {ok:true, messages, user});
    }).catch(err => {
        console.log(err);
        return fn.except(res, err)
    })
}

// obtiene la lista de los usuarios que han enviado mensajes
async function getEmitters(req, res){
    let page = 1;
    let pageSize = 10;

    if(req.query.page)
        page = req.query.page;

    const offset = (page-1) * pageSize
    const limit = offset + pageSize    

    let emitters =  await Message.findAll({
        offset, limit,
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('emitter')), 'emitter'],],
        where: {
           receiver: req.user.id
        },                
    });

    let receivers = await getReceivers(req.user.id);

    if(!emitters && !receivers) return fn.error(res, 'No tienes mensajes')        
    
    let final_emmiters = [];
    let ids = [];
    
    for(let e of emitters){
        ids.push(e.dataValues.emitter);     
    }
    
    for(let r of receivers){
        if(!_.contains(ids, r.dataValues.receiver)){  
            ids.push(r.dataValues.receiver);              
        }
    }

    for(let user_id of ids){
        let user = await getUser(user_id);
        final_emmiters.push(user);
    }

    return fn.object(res, {ok:true, users: final_emmiters });    
}

function getReceivers(user_id){
    return Message.findAll({        
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('receiver')), 'receiver'],],
        where: {
            emitter: user_id
        },                
    });
}

// Obtener datos del emisor de un mensajes
function getUser(user_id){
    return User.findByPk(user_id, { attributes: ['id', 'username', 'name', 'lastname', 'avatar']})
}

module.exports = {
    addMessage, getMessages, getEmitters
}

