const fn = require('./fn');
const {notifyPublication} = require('./notification');
const {Comment, User, Publication} = require('./../db')

function addComment(req, res){
    let r = req.body;
    let pub_id = null;
    let market_id  = null;

    if(!r.text){
        return fn.error(res, "Proporciona un comentario para el post")
    }

    if(!r.pub_id && !r.market_id){
        return fn.error(res, 'La publicación no existe');
    }

    pub_id = r.pub_id;
    market_id = r.market_id;

    Comment.create({
        text: r.text,
        publication_id: pub_id,
        market_id,
        user_id: req.user.id,
        created_at: `${ fn.date() }`,
        updated_at: `${ fn.date() }`,
    }).then(comment => {
        if(!comment) return fn.error(res, "Error al guardar el comentario, reintente")
        
        notifyPublication(req.user, pub_id, 'COMMENT');

        return fn.object(res, {ok: true, comment});
    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    })
}

function getLastComment(req, res){
    
    let type = req.params.type;
    let id = req.params.id;
    let where = {};

    if(!fn.validPublication(type)){
        return fn.error(res, 'Publicacion no valida');
    }

    if(type === 'pub')
        where = { publication_id: id }
    else 
        where =  { market_id: id }

    Comment.findOne({
        attributes: ['id', 'text', 'parent', 'publication_id', 'market_id', 'created_at'],
        where,
        order: [['created_at', 'desc']],
        include: { model: User, as: 'commentor', attributes: ['id', 'username', 'name' ,'lastname', 'avatar']}
    }).then(comment => {
        if(!comment) return fn.object(res, {ok: true, comment: []})

        return fn.object(res, { ok: true, comment})
    }).catch(err => {
        console.log(err)
        return fn.except(res, err)
    }) ;
}

function getComments(req, res){
    let page = 1;
    let type = req.params.type;
    let id = req.params.id;
    let where = {};    
    let limit = 5;

    if(!fn.validPublication(type)){
        return fn.error(res, 'Publicacion no valida');
    }

    if(type === 'pub')
        where = { publication_id: id }
    else 
        where =  { market_id: id }

    if(req.query.page)
        page = req.query.page;

    if(req.query.limit)
        limit = req.query.limit

    let lo = fn.limit_offset(page, limit);

    Comment.findAll({
        attributes: ['id', 'text', 'parent', 'publication_id', 'market_id', 'created_at'],    
        where,
        include: { model: User, as: 'commentor', attributes: ['id', 'username', 'name' ,'lastname', 'avatar']},
        order: [['created_at', 'desc']],
        subQuery: false,
        limit: lo.limit, offset: lo.offset
    }).then(comments => {
        return fn.object(res, { ok:true, comments})
    }).catch(err => {
        console.log(err);
        return fn.except(res, err);
    })
}

async function destroyComment(req, res){
    let id = req.params.id;

    try {
        let comment = await Comment.findByPk(id);
    
        if(!comment) return fn.error(res, 'Comentario no encontrado');

        if(comment.user_id !== req.user.id){
            return fn.error(res, 'No tienes permiso para eliminar este comentario...')
        }

        comment.destroy();

        return fn.object(res, {ok: true, id, message: 'Comentario eliminado con exito!'});

    } catch (err) {
        console.log(err);
        return fn.except(res, err);
    }
    



}

module.exports = {
    addComment, getLastComment, getComments, destroyComment
}