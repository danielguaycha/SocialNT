const fn = require('./fn');
const Notification = require('./../models/notification');
const {Publication, Follow, User, Market} = require('../db');

async function notifyPublication(from, pub_id, type = 'LIKE'){

    if(!pub_id || !from) return false;

    try{
        
        // publication Logic

        let pub = await Publication.findByPk(pub_id);
        if(!pub) return false;

        // exists Notify
        let finded =  await Notification.findOne({
            where: {
                from: from.id,
                to: pub.user_id,
                type,
                resource: 'PUB',
                resource_id: pub.id
            }
        });

        if(finded)
            finded.destroy();

        if(pub.user_id === from.id) return false;

        let description = '';
        
        if(type.toUpperCase() === 'COMMENT'){
            description = `<b>${from.name} ${from.lastname}</b> ha comentado una publicación tuya`;
        }

        if(type.toUpperCase() === 'LIKE'){
            description = `A <b>${from.name} ${from.lastname}</b> le ha gustado una publicación tuya`
        }

        Notification.create({
            type,
            to: pub.user_id,
            from: from.id,
            description,
            resource: 'PUB',
            resource_id: pub.id,
            url: `/publication/${pub.id}`,
            created_at: `${fn.date()}`,
        }).then(notify => {
            if(notify)
                return true;
        }).catch(err => {
            console.log(err);
            return false;
        })
    } catch(e){
        console.log(e);
        return false;
    }   
    
}

async function notifyFollow(from, follow_id, type = 'FOLLOW'){
    if(!from) return false;

    try{

        let follow = await Follow.findByPk(follow_id);
        if(!follow) return false;

        let finded = await Notification.findOne({ where: {
            from: from.id,
            to: follow.followed,
            type,
            resource: 'FOLLOW',
            resource_id: follow.followed,
        }});

        if(finded)
            finded.destroy();

        const description = `<b>${from.name} ${from.lastname}</b> ahora te sigue`;

        Notification.create({
            type,
            description,
            from: from.id,
            to: follow.followed,
            resource: 'FOLLOW',
            resource_id: follow.followed,
            url: `/u/${from.id}`,
            created_at: `${fn.date()}`,
        }).then(notify => {
            if(!notify) return false;

            return true;
        })
    } catch(e) {
        console.log(e);
        return false;
    }
}

async function notifyMarket(req, res) {
    
    let r = req.body;
    
    if(!r.market_id){ fn.error(res, 'Especifique una publicación del marketPlace') }

    try {
        let market = await Market.findByPk(r.market_id);
        if(!market) return fn.error(res, 'No se encontró la publicación');

        let finded = await Notification.findOne({ where: {
            type: 'INFO_MARKET',
            to: market.user_id,
            from: req.user.id,
            resource: 'MARKET',
            resource_id: market.id,
        }});

        if(finded)
            finded.destroy();
        
        const description = `<b>${req.user.name} ${req.user.lastname}</b> le interesa tu producto <b>${market.title}</b>`;
        
        Notification.create({
            type: 'INFO_MARKET',
            to: market.user_id,
            from: req.user.id,
            description,
            resource: 'MARKET',
            resource_id: market.id,
            url: `/marketplace/item/${market.id}`,
            created_at: `${fn.date()}`,
        }).then(notify => {
            if(!notify) return false;

            return true;
        }).catch(err => {
            console.log(err);
            return false;
        })

    } catch (e) {
        console.log(e);
        return false;
    }
}

function getNotifications(req, res){

    let page = 1;
    let limit = 7;
    if(req.query.page)
        page = req.query.page;

    if(req.query.limit)
        limit = req.query.limit;

    let lo = fn.limit_offset(page, limit);

    Notification.findAll({
        limit: lo.limit,
        offset: lo.offset,
        where: {
            to: req.user.id
        },
        include: [{model: User, as:'fromUser', attributes: ['id', 'avatar', 'username', 'name', 'lastname']}],
        order: [['created_at', 'desc'], ['status', 'desc']]
    }).then(notifies => {
        return fn.all(res, notifies);
    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    })
}

function changeToView(req, res) {
    let id = req.params.id;

    Notification.findByPk(id).then(notify => {

        if(!notify) { return fn.error(res, 'No se encontró la notificación!')}

        if(req.user.id !== notify.to)
            return fn.ok(res, 'Esta notificación no es tuya');
        
        if(notify.status === 0)
            return fn.ok(res, notify)

        notify.update({
            status: 0
        }).then(rows => {
            return fn.all(res, rows);
        })

    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    })

}

function deleteNotification(req, res){
    let id = req.params.id;

    Notification.findByPk(id).then(notify => {

        if(!notify) return fn.error(res, 'No se encontro la notificación');

        if(notify.to !== req.user.id)
            return fn.error(res, 'No tienes permiso para ejecutar esta acción');

        notify.destroy().then( () => {
            return fn.ok(res, 'Notificacion eliminada con éxito');
        })

    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    })
}

module.exports = {
    notifyPublication, getNotifications, changeToView, 
    deleteNotification, notifyFollow, notifyMarket
}

