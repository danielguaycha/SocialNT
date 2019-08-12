const Follow = require('./../models/follow');
const User = require('./../models/user');
const {sequelize} = require('./../db')
const { notifyFollow } = require('./notification')
const fn = require('./fn')

// Seguir a un usuario
async function follow(req, res){
    let r = req.body;
    let user_id = req.user.id;

    if(!r.user_follow)
        return fn.error(res, "Proporciona un usuario a seguir");
    // valida que exista el usuario a seguir
    let user_exist = await User.findByPk(r.user_follow);    
    if(!user_exist)
        return fn.error(res, "El usuario al que intentas seguir no existe!")

    // valida que un usuaro no este ya siendo seguido
    let ya_sigue = await Follow.findOne({ where: { user_id,  followed: r.user_follow }});
    if(ya_sigue)
        return fn.error(res, "Ya estas siguiendo a este usuario")

    Follow.create({
        user_id: user_id,
        followed: r.user_follow
    }).then( follow => {

        notifyFollow(req.user, follow.id);

        return fn.ok(res, "Ahora sigues a "+user_exist.name)
    }).catch( err => {
        console.log(err);
        return fn.except(res, err)
    })
}

// Listar usuarios seguidos por me
function followedUsers(req, res){
    let page = 1;
    let limit = 20;
    let user_id = req.user.id;

    if(req.params.user)
        user_id = req.params.user

    // pagination
    if(req.query.page)
        page = req.query.page;
    // limit
    if(req.query.limit)
        limit = req.query.limit;

    let lo = fn.limit_offset(page, limit);
    Follow.findAll({ 
        attributes: ['followed'],
        where: { user_id: user_id },
        include: [{model: User, as: 'person', attributes:[ 'name', 'lastname', 'avatar','username', 'id']}],
        limit: lo.limit,
        offset: lo.offset
    }).then( users => {
        if(users.length <= 0 )
            return fn.object(res, {ok:true, followed: [], message: "No está siguiendo a ninguna persona" });            
        
        return fn.object(res, {ok:true, followed: users});
    }).catch( err => {
        console.log(err);
        return fn.except(res, err);
    })
}

// listar Usuarios que me siguen
async function followerUsers(req, res){
    let page = 1;
    let limit = 20;
    let user_id = req.user.id;

    if(req.params.user)
        user_id = req.params.user
    
    // pagination
    if(req.query.page)
        page = req.query.page;

    // limite
    if(req.query.limit)
         limit = req.query.limit;

    let lo = fn.limit_offset(page, limit)

    let follows = await Follow.findAll({ 
        attributes: ['user_id'],
        where: { followed: user_id },
        include: [{model: User, as: 'person2', attributes:['id','name', 'lastname', 'avatar', 'id', 'username']}],
        limit: lo.limit,
        offset: lo.offset
    });

    if(follows.length <= 0 )
        return fn.object(res, {ok:true, followed: [], message: "Aún nadie lo ha seguido :)" }); 

    for(let u in follows){
        follows[u].dataValues.isFollow = await isFollow(req.user.id, follows[u].user_id);
    }
    
    return fn.object(res, {ok:true, followed: follows});        
    /*Follow.findAll({ 
        attributes: ['user_id'],
        where: { followed: user_id },
        include: [{model: User, as: 'person2', attributes:['id','name', 'lastname', 'avatar', 'id', 'username']}]
    }).then( users => {
        if(users.length <= 0 )
            return fn.ok(res, "Aún nadie lo ha seguido :)")
        
        return fn.object(res, {ok:true, followed: users});
    }).catch( err => {
        console.log(err);
        return fn.except(res, err);
    })*/
}

//Dejar de seguir a un usuario
async function unfollow(req, res){
    let r = req.body;
    let user_id = req.user.id;

    if(!r.user_follow)
        return fn.error(res, "Proporciona un usuario a dejar de seguir");
    // valida que exista el usuario a seguir
    let user_exist = await User.findByPk(r.user_follow);    
    if(!user_exist)
        return fn.error(res, "El usuario al que intentas dejar de eguir no existe!")

    // valida que un usuaro no este ya siendo seguido
    let ya_sigue = await Follow.findOne({ where: { followed: r.user_follow, user_id }});
    if(!ya_sigue)
        return fn.error(res, "No estas siguiendo a este usuario")

    ya_sigue.destroy().then( () => {
        return fn.ok(res, "Has dejado de seguir a "+user_exist.name)
    }).catch(err => {
        console.log(err);
        return fn.except(res, err)
    });
}

// obtener estadisticas
async function getStats(req, res){
    let user_id = req.user.id;

    if(req.params.user)
        user_id = req.params.user;

    let followed = await Follow.findAll({
        attributes: [[sequelize.fn('count', sequelize.col('*')), 'count']],
        where: { user_id: user_id }
    })

    let follower = await Follow.findAll({
        attributes: [[sequelize.fn('count', sequelize.col('*')), 'count']],
        where: { followed: user_id }
    })

    return fn.object(res, {ok: true, followed: followed[0], followers: follower[0] });    
}


// comprobar si el usuario A sigue al usuario B
function isFollow(userA, userB){
    return new Promise((resolve, reject) => {
        Follow.findOne({
            attributes: ['id'],
            where :{ user_id: userA, followed: userB }
        }).then(user => {
            if(!user) resolve(false);
            if(user == null)
                resolve(false)
            resolve(true);
        }).catch(err => {
            console.log(err);
            reject(err)
        })
    })
    
}

// comprobar si un usuario es seguido proporcionado el username

function getByUsername(username){    
    return User.findOne({
        where: { username: username },
        attributes: ['id', 'username', 'avatar', 'name', 'lastname']
    });
}


module.exports = {
    follow, followedUsers, followerUsers, unfollow, getStats, isFollow, getByUsername
}