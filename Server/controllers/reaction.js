const {Reaction, User} = require('./../db')
const fn = require('./fn');
const { notifyPublication } = require('./notification')

// Agregar una reaccion
async function addReaction(req, res){

    let r = req.body;
    let pub_id = null;
    let market_id = null;


    if(!r.pub_id && !r.market_id){
        return fn.error(res, 'La publicación es necesaria')
    }

    if(!r.type){
        return fn.error(res, 'Envie el tipo de reacción');
    }

    if(r.pub_id) pub_id = r.pub_id
    if(r.market_id) market_id = r.market_id;

    let react = await isReact(pub_id, market_id, req.user.id);
    if(react){
        await react.destroy();
        return fn.ok(res, -1)
    }

    Reaction.create({
        user_id: req.user.id,        
        pub_id,
        market_id,
        type: r.type.toUpperCase()
    }).then(reaction => {

        if(!reaction) return fn.error(res, 'No se ha reaccionado a esta publicación')

        notifyPublication(req.user, pub_id, 'LIKE');

        return fn.ok(res, 1)
    }).catch(err => {
        console.log(err);
        return fn.except(res, err)
    })
}

// obtener las reacciones par una publicacion
function getPublicationReactions(req, res){
    let r = req.body;
    let type = req.params.type;
    let id = req.params.id;    
    
    let where = {};

    if(type !=='pub' && type !== 'market')
        return fn.error(res, 'Reacciones no encontradas', 404)

    if(type === 'pub')
        where = { pub_id : id }
    else 
        where = { market_id: id}

    Reaction.count({        
        where
    }).then(result => {

        return fn.object(res, {ok: true, total: result })

    }).catch(err => {
        console.log(err);
        return fn.except(res, err)
    })
}

// comprueba si el usuario ya ha reaccionado
function isReact(pub_id=null, market_id=null, user_id, type='LIKE'){
   return Reaction.findOne({
        where: {
            type, pub_id, market_id, user_id
        }
    });
}

// obtener los usuarios que reaccionaraon a cierta publicacion
function getUsersReactions(req, res){
    let page = 1;
    let id = req.params.id;
    let type = req.params.type;
    let where = {};
    
    if(req.query.page)
        page = req.query.page;

    let lo = fn.limit_offset(page, 5);
    
    if(!fn.validPublication(type)) return fn.error(res, 'Tipo de publicacion no valida')
    
    if(type === 'pub') 
        where = { pub_id: id}
    else
        where =  { market_id: id}
    
    Reaction.findAll({
        limit: lo.limit, offset: lo.offset,
        where,
        attributes: ['user_id'],
        include: [{model: User, as : 'user', attributes: ['username', 'name', 'lastname', 'avatar', 'id']}]
    }).then( users => {
     
        return fn.object(res, {ok:true, users})
    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    })
    
}


module.exports = {
    addReaction,
    getPublicationReactions,
    getUsersReactions
}
